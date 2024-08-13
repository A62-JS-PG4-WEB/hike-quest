import { ref, push, get, set, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MAX_TAGS_COUNT } from '../common/constants';

export const deleteCommentFromThread = async (threadId, commentId) => {
  const commentRef = ref(db, `threads/${threadId}/comments/${commentId}`);
  await remove(commentRef);
};
export const updateCommentInThread = async (threadId, commentId, updatedText) => {
  const commentRef = ref(db, `threads/${threadId}/comments/${commentId}`);
  await update(commentRef, { text: updatedText });
};
export const createThread = async (author, title, content, location) => {

  const thread = { author, title, content, createdOn: new Date().toString(), location };
  const result = await push(ref(db, 'threads'), thread);
  const id = result.key;

  await update(ref(db), {
    [`threads/${id}/id`]: id,
  });
};

export const getThreadsCount = async () => {
  const snapshot = await get(ref(db, 'threads'));

  const threads = Object.values(snapshot.val());
  return threads.length;
};

export const getUsersCount = async () => {
  const snapshot = await get(ref(db, 'users'));
  const users = Object.values(snapshot.val());
  return users.length;
};


//TODO Fix filtering
export const getAllThreads = async (search = '', sort = '', userFilter = '') => {
  const snapshot = await get(ref(db, 'threads'));
  if (!snapshot.exists()) return [];

  const threads = Object.values(snapshot.val())
    .map(thread => ({
      ...thread,
      commentCount: thread.comments ? Object.keys(thread.comments).length : 0,
      likeCount: thread.likedBy ? Object.keys(thread.likedBy).length : 0,
    }));

  if (search) {
    return threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (userFilter) {
    return threads.filter(t => t.author.toLowerCase().includes(userFilter.toLowerCase()));
  }

  if (sort === 'date') {
    return threads.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
  } else if (sort === 'title') {
    return threads.sort((a, b) => a.title.localeCompare(b.title));
  }
  return threads;
};

export const getThreadById = async (id) => {
  const snapshot = await get(ref(db, `threads/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Thread not found!');
  }

  return {
    ...snapshot.val(),
    likedBy: Object.keys(snapshot.val().likedBy ?? {}),
  };
};

export const likeThread = (handle, threadId) => {
  const updateObject = {
    [`threads/${threadId}/likedBy/${handle}`]: true,
    [`users/${handle}/likedThreads/${threadId}`]: true,
  };
  toast.success('Liked');
  return update(ref(db), updateObject);
};

export const dislikeThread = (handle, threadId) => {
  const updateObject = {
    [`threads/${threadId}/likedBy/${handle}`]: null,
    [`users/${handle}/likedThreads/${threadId}`]: null,
  };

  return update(ref(db), updateObject);
};


export const deleteThread = async (threadId) => {
  try {
    const threadRef = ref(db, `threads/${threadId}`);
    await remove(threadRef);
    await remove(ref(db, `posts/${threadId}`));
    toast.success('Thread deleted successfully.');
  } catch (error) {
    toast.error('Error deleting thread: ' + error.message || error);
    throw error;
  }
}


export const subscribeToThreadChanges = (callback) => {
  const threadsRef = ref(db, 'threads');

  const handleData = (snapshot) => {
    const threads = snapshot.val();
    const count = threads ? Object.keys(threads).length : 0;
    callback(count);
  };

  const unsubscribe = onValue(threadsRef, handleData);
  return unsubscribe;
};

export const addCommentToThread = async (threadId, comment) => {
  try {

    const commentsRef = push(ref(db, `threads/${threadId}/comments`));

    const commentData = {
      ...comment,
      createdOn: new Date().toString()
    };

    await set(commentsRef, commentData);
  } catch (error) {
    toast.error('Error adding comment:', error);
  }
}


export const getCommentsByThread = async (threadId) => {
  try {
    const snapshot = await get(ref(db, `threads/${threadId}/comments`));

    if (!snapshot.exists()) return [];

    const comments = Object.entries(snapshot.val()).map(([id, props]) => ({ id, ...props }));

    return comments;
  } catch (error) {
    toast.error(`Error getting comments for ${threadId} :`, error);
  }

}

export const getTagCount = async (threadId) => {

  try {
    const snapshot = await get(ref(db, `posts/${threadId}`));
    const tags = snapshot.val();

    if (!tags) {
      return 0;
    }

    const tagCount = Object.values(tags).length;
    return tagCount;
  } catch (error) {
    console.error('Error fetching tag count:', error);
    throw new Error('Failed to retrieve tag count');
  }
};

export const createTag = async (threadId, tag) => {
  if (!tag.trim()) {
    return;
  }
  const count = await getTagCount(threadId);
  console.log(count);

  if (count > MAX_TAGS_COUNT) {
    toast.warning('Tag limit exceeded (10)!');
    return;
  }
  const allTags = await fetchAllTags();

  const existingTagEntry = Object.entries(allTags).find(([id, name]) => name === tag.trim());
  const existingTagId = existingTagEntry ? existingTagEntry[0] : null;

  if (existingTagId) {
    const allPosts = await fetchAllPosts(threadId);

    const existingTagPost = allPosts.includes(existingTagId);

    if (existingTagPost) {
      return;
    } else {
      await update(ref(db), {
        [`posts/${threadId}/${existingTagId}`]: true,
      });
    }

  } else {
    try {
      const tagRef = push(ref(db, 'tags'), tag.trim());
      const tagId = tagRef.key;

      await update(ref(db), {
        [`posts/${threadId}/${tagId}`]: true,
      });

      return tagId;
    } catch (error) {
      toast.error("Error creating tag:", error);
      throw error;
    }
  }
};

const fetchAllTags = async () => {
  const snapshot = await get(ref(db, 'tags'));
  return snapshot.exists() ? snapshot.val() : {};
}

const fetchAllPosts = async (threadId) => {
  const snapshot = await get(ref(db, `posts/${threadId}`));
  return snapshot.exists() ? Object.keys(snapshot.val()) : [];
}


export const fetchTagsForPost = async (threadId) => {
  const postSnapshot = await get(ref(db, `posts/${threadId}`));

  if (!postSnapshot.exists()) {
    return [];
  }

  const tagIds = Object.keys(postSnapshot.val());

  const tagsSnapshot = await get(ref(db, 'tags'));

  if (!tagsSnapshot.exists()) {
    return [];
  }

  const allTags = tagsSnapshot.val();

  const tagsForPost = tagIds.map(tagId => ({
    id: tagId,
    name: allTags[tagId]
  }));

  return tagsForPost;
};

export const fetchPostsByTag = async (threadId, tagId) => {
  const postRef = ref(db, `posts/${threadId}/${tagId}`);
  const snapshot = await get(postRef);
  const result = snapshot.val();

  return result;
};


export const deleteTag = async (threadId, tagId) => {
  const tagRef = ref(db, `posts/${threadId}/${tagId}`);
  await remove(tagRef);
}