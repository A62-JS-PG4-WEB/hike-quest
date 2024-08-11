import { ref, push, get, set, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config'

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
    console.log(`Thread with ID ${threadId} removed successfully.`);
  } catch (error) {
    console.error('Error deleting thread:', error);
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

    console.log("Comment added successfully");
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}


export const getCommentsByThread = async (threadId) => {
  try {
    const snapshot = await get(ref(db, `threads/${threadId}/comments`));

    if (!snapshot.exists()) return [];

    const comments = Object.entries(snapshot.val()).map(([id, props]) => ({ id, ...props }));

    return comments;
  } catch (error) {
    console.error(`Error getting comments for ${threadId} :`, error);
  }

}

export const createTag = async (threadId, tag) => {
  if (!tag.trim()) {
    return;
  }
  const allTags = await fetchAllTags();
  console.log("all tags", allTags);

  const existingTagEntry = Object.entries(allTags).find(([id, name]) => name === tag.trim());
  const existingTagId = existingTagEntry ? existingTagEntry[0] : null;
  console.log('Existing tag:', existingTagEntry);

  if (existingTagId) {
    const allPosts = await fetchAllPosts(threadId);
    console.log('All posts:', allPosts);

    const existingTagPost = allPosts.includes(existingTagId);
    console.log('Tag exists in post:', existingTagPost);

    if (existingTagPost) {
      console.log('Tag already exists in the post.');
      return;
    } else {
      await update(ref(db), {
        [`posts/${threadId}/${existingTagId}`]: true,
      });
      console.log('Tag exists, added to the post.');
    }

  } else {
    try {
      const tagRef = push(ref(db, 'tags'), tag.trim());
      const tagId = tagRef.key;

      await update(ref(db), {
        [`posts/${threadId}/${tagId}`]: true,
      });

      console.log('Created new tag and added to the post.');
      return tagId;
    } catch (error) {
      console.error("Error creating tag:", error);
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