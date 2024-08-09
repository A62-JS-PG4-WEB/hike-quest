import { get, set, ref, query, equalTo, orderByChild, update  } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateEmail } from "firebase/auth";

export const updateUserStatus = async (handle, updates) => {
  try {
    await update(ref(db, `users/${handle}`), updates);
    console.log('User status updated successfully');
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, 'users'));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error('No data available');
      return {};
    }
  } catch (error) {
    console.error('Error fetching users:', error);
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

// export const updateEmailInAuth = async (user, newEmail) => {
   
//   if (!user) {
//     throw new Error("No authenticated user found.");
// }

// try {
//     await updateEmail(user, newEmail);
// } catch (error) {
//     throw new Error('Error updating email in Auth: ' + error.message);
// }
// };

export const updateEmailInAuth = async (profileData) => {
  const user = auth.currentUser;
 console.log(profileData);
 
 
  if (!user) {
    throw new Error('User is not authenticated');
  }
 
update(ref(db, `users/${user.uid}`));  
  try {
    if (profileData.email && profileData.email !== user.email) {
      console.log('Attempting to update email...');
      await updateEmail(user, profileData.email);
      console.log('Email updated in Firebase Auth');
    }
 
 
    // console.log('Updating user profile in Realtime Database...');
    // await update(userRef, {
    //   firstName: profileData.firstName,
    //   lastName: profileData.lastName,
    //   email: profileData.email,
    // });
 
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};