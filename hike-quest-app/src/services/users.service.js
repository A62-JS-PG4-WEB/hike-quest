import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const updateUserStatus = async (handle, updates) => {
  try {
    await update(ref(db, `users/${handle}`), updates);
  } catch (error) {
    toast.error('Error updating user status:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      toast.error('No data available');
      return {};
    }
  } catch (error) {
    toast.error('Error fetching users:', error);
    throw error;
  }
};
export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, firstName, lastName, uid, email, isAdmin, isBlocked) => {
  const user = { handle, firstName, lastName, uid, email, isAdmin, isBlocked, createdOn: new Date().toString() };
  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const getUserByEmail = async (email) => {

  const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));

  return snapshot.val();
};

export const updateAccountInfoDB = async (handle, newEmail, firstName, lastName) => {
  try {
    await update(ref(db, `users/${handle}`), { email: newEmail, firstName, lastName });
  } catch (error) {
    toast.error('Error updating personal info:', error);
    throw new Error(error.message);
  }
};

export const updateEmailInAuth = async (profileData) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  update(ref(db, `users/${user.uid}`));
  try {
    if (profileData.email && profileData.email !== user.email) {
      await updateEmail(user, profileData.email);
    }

  } catch (error) {
    toast.error('Error updating user profile:', error);
    throw error;
  }
};