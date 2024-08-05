import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, remove } from 'firebase/database';
import { db } from '../config/firebase-config'

export const createThread = async (author, title, content) => {
  console.log("createservicethread",author);
  const thread = { author, title, content, createdOn: new Date().toString() };
  const result = await push(ref(db, 'threads'), thread);
  const id = result.key;
  await update(ref(db), {
    [`threads/${id}/id`]: id,
  });
};

export const getThreadsCount = async () => {
  const snapshot = await get(ref(db, 'threads'));
  console.log(snapshot);

  const threads = Object.values(snapshot.val());
  return threads.length;
};

export const getAllThreads = async (search = '') => {
  const snapshot = await get(ref(db, 'threads'));
  if (!snapshot.exists()) return [];

  const threads = Object.values(snapshot.val());

  if (search) {
    return threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
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