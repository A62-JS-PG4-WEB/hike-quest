import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config'

export const createThread = async (author, title, content) => {

  const thread = { author, title, content, createdOn: new Date().toString() };
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

export const getAllThreads = async (search = '', sort = '', filter = '') => {
  const snapshot = await get(ref(db, 'threads'));
  if (!snapshot.exists()) return [];

  const threads = Object.values(snapshot.val());

  if (search) {
    return threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (filter) {
    return threads.filter(t => t.author.toLowerCase().includes(filter.toLowerCase()));
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

export const getAllComments = async(threadId) => {
  const snapshot = await get(ref(db, `threads/${threadId}/comments`));
  if (!snapshot.exists()) return [];

  console.log(snapshot);
  return Object.values(snapshot.val());
}