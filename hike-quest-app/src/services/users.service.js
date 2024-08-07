import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAuth, updateEmail } from 'firebase/auth';


export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, firstName, lastName, uid, email, isAdmin, isBlocked) => {
  const user = { handle, firstName, lastName, uid, email, isAdmin, isBlocked, createdOn: new Date().toString() };
  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  //console.log('getuser data uid N',uid);
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const getUserByEmail = async (email) => {

  const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));

  return snapshot.val();
};

export const updateEmailDB = async (handle, newEmail) => {
  try {
    await update(ref(db, `users/${handle}`), { email: newEmail });
    console.log('Email updated successfully');
  } catch (error) {
    console.error('Error updating email:', error);
    throw new Error(error.message);
  }
};

export const updateEmailInAuth = async (newEmail) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await updateEmail(user, newEmail);
      console.log('Email updated successfully in Firebase Authentication.');
    } catch (error) {
      console.error('Failed to update email in Firebase Authentication:', error.message);
      throw new Error(error.message);
    }
  } else {
    throw new Error('No authenticated user found.');
  }
};