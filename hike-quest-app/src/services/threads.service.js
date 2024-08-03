import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey } from 'firebase/database';
import { db } from '../config/firebase-config'
//author,
export const createThread = async ( title, content) => {
  const thread = {  title, content, createdOn: new Date().toString() };
  const result = await push(ref(db, 'threads'), thread);
  const id = result.key;
  await update(ref(db), {
    [`threads/${id}/id`]: id,
  });
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

// export const createTweet = async (title, content) => {
//   const response = await fetch('http://127.0.0.1:3000/tweets', {
//     method: 'POST',
//     body: JSON.stringify({ title, content }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getAllTweets = async (search = '') => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets?search=${search}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// export const getTweetById = async (id) => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets/${id}`);

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

// /**
//  * 
//  * @param {{
// *  id: number,
// *  title: string,
// *  content: string,
// *  createdOn: string,
// *  liked: boolean
// * }} tweet 
//  * @returns 
//  */
// export const updateTweet = async (tweet) => {
//   const response = await fetch(`http://127.0.0.1:3000/tweets/${tweet.id}`, {
//     method: 'PUT',
//     body: JSON.stringify(tweet),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Something went wrong!');
//   }

//   return response.json();
// };

