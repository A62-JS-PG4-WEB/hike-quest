import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


const reauthenticateUser = async (password) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User is not authenticated');
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credential);
    } catch (error) {
        console.error('Error reauthenticating user:', error);
        throw new Error('Reauthentication failed. Please check your password.');
    }
};


export const updateProfilePicture = async (userId, file) => {
    const storage = getStorage();
    const fileRef = storageRef(storage, `profile_pictures/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
};


export const updateUserProfile = async (userId, updatedUserData, currentPassword = '') => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User is not authenticated');
        }

        if (updatedUserData.email && updatedUserData.email !== user.email) {
            if (!currentPassword) {
                throw new Error('Current password is required for email update');
            }

            await reauthenticateUser(currentPassword);
            await updateEmail(user, updatedUserData.email);
        }

        if (updatedUserData.firstName || updatedUserData.lastName) {
            await updateProfile(user, {
                displayName: `${updatedUserData.firstName || ''} ${updatedUserData.lastName || ''}`,
            });
        }

        const userRef = ref(db, `users/${userId}`);
        await update(userRef, {
            firstName: updatedUserData.firstName,
            lastName: updatedUserData.lastName,
            email: updatedUserData.email,
        });

        if (updatedUserData.profileImageUrl) {
            await updateProfileImageInDB(userId, updatedUserData.profileImageUrl);
        }

        console.log('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};


export const updateProfileImageInDB = async (userId, imageUrl) => {
  const userRef = ref(db, `users/${userId}`);
  await update(userRef, { profileImageUrl: imageUrl });

  const threadsRef = ref(db, `threads`);
  const threadsSnapshot = await get(threadsRef);

  if (threadsSnapshot.exists()) {
      const threads = threadsSnapshot.val();
      const updates = {};

      for (const threadId in threads) {
          const thread = threads[threadId];

          if (thread.authorId === userId) {
              updates[`threads/${threadId}/authorProfileImage`] = imageUrl;
          }

          if (thread.comments) {
              for (const commentId in thread.comments) {
                  const comment = thread.comments[commentId];
                  if (comment.userId === userId) {
                      updates[`threads/${threadId}/comments/${commentId}/userProfileImage`] = imageUrl;
                  }
              }
          }
      }

      if (Object.keys(updates).length) {
          await update(ref(db), updates);
      }
  }
};


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
        console.log('Info updated successfully');
    } catch (error) {
        console.error('Error updating personal info:', error);
        throw new Error(error.message);
    }
};