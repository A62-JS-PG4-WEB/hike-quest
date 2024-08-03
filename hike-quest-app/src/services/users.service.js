import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';


export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, uid, email) => {
  const user = { handle, uid, email, createdOn: new Date().toString() };
  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  console.log('getuser data uid N',uid);
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const getUserByEmail = async (email) => {
  console.log('getuser data email',email);
  const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
  console.log(snapshot);
  return snapshot.val();
};

// export const getUserByHandle = async (firstName) => {
//   const snapshot = await get(ref(db, `users/${firstName}`));
//   return snapshot.val();
// };

// export const createUserHandle = async (firstName, lastName, uid, email) => {
//   console.log("createUserHandle",email);
//   if (!firstName || !lastName || !uid || !email) {
//     console.error("Missing user information:", { firstName, lastName, uid, email });
//     throw new Error("Incomplete user information provided.");
//   }

//   const user = { firstName, lastName, uid, email, createdOn: new Date().toString() };
//   console.log("user",user);
//   await set(ref(db, `users/${firstName}`), user);  // Ensure you're using a unique identifier for the path
// };

// export const getUserData = async (uid) => {
//   const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
//   return snapshot.val();
// };

