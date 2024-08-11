import { getDatabase, ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, remove, onValue } from 'firebase/database';
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

export const createTag = async ( threadId, tags) => {
  console.log(tags);
  console.log(threadId);

  const tag = { tags };
  const result = await push(ref(db, 'tags'), tag);
  const id = result.key;
  await update(ref(db), {
    [`tags/${id}/id`]: id,
   
  });
  const resultPost = await push(ref(db, 'posts'), threadId);
  const idTag = resultPost.key;
  await update(ref(db), {
    [`/posts/${threadId}`]:idTag
   
  });


   // [`/posts/${threadId}`]:id
};

// export const createTag = async (threadId, tag, post) => {
//   // Generating a unique ID for the tag
//   const tagId = new Date().getTime().toString(); 

//   // Firebase update object
//   const updates = {};

//   // Updating the tags collection with the new tag
//   updates[`/tags/${tag}`] = tagId;

//   // Updating the posts collection with the postId as key and tagId as value
//   updates[`/posts/${threadId}`] = tagId;

//   // Committing the updates to Firebase
//   await update(ref(db), updates);
// };