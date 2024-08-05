import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';


export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, firstName, lastName, uid, email) => {
  const user = { handle, firstName, lastName, uid, email, createdOn: new Date().toString() };
  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  //console.log('getuser data uid N',uid);
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const getUserByEmail = async (email) => {
  console.log('getuser data email',email);
  const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
  console.log(snapshot);
  return snapshot.val();
};
