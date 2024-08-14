import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Updates the user's email address.
 *
 * @param {string} newEmail - The new email address.
 * @param {string} currentPassword - The current password for reauthentication.
 * @throws {Error} Throws an error if the user is not authenticated or if reauthentication fails.
 * @returns {Promise<void>} Resolves when the email is updated successfully.
 */
export const updateUserEmail = async (newEmail, currentPassword) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User is not authenticated');
        }

        await reauthenticateUser(currentPassword);
        await updateEmail(user, newEmail);

        toast.success('Email updated successfully.');
    } catch (error) {
        toast.error('Error updating email: ' + error.message);
        throw new Error(error.message);
    }
};

/**
 * Reauthenticates the current user with the provided password.
 *
 * @param {string} password - The password for reauthentication.
 * @throws {Error} Throws an error if the user is not authenticated or if reauthentication fails.
 * @returns {Promise<void>} Resolves when reauthentication is successful.
 */
const reauthenticateUser = async (password) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User is not authenticated');
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credential);
    } catch (error) {
        toast.error('Error reauthenticating user:', error);
        throw new Error('Reauthentication failed. Please check your password.');
    }
};

/**
 * Uploads a profile picture and returns its download URL.
 *
 * @param {string} userId - The ID of the user.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} The download URL of the uploaded profile picture.
 */
export const updateProfilePicture = async (userId, file) => {
    const storage = getStorage();
    const fileRef = storageRef(storage, `profile_pictures/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
};

/**
 * Updates user profile information including email, display name, and profile image.
 *
 * @param {string} userId - The ID of the user.
 * @param {Object} updatedUserData - The updated user data.
 * @param {string} [currentPassword=''] - The current password for reauthentication if email is updated.
 * @throws {Error} Throws an error if the user is not authenticated or if updating fails.
 * @returns {Promise<void>} Resolves when the profile is updated successfully.
 */
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

        toast.success('User profile updated successfully');
    } catch (error) {
        toast.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Updates the profile image URL in the database and adjusts any relevant threads or comments.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} imageUrl - The new profile image URL.
 * @throws {Error} Throws an error if updating the database fails.
 * @returns {Promise<void>} Resolves when the profile image URL is updated successfully.
 */
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

/**
 * Updates a user's status information in the database.
 *
 * @param {string} handle - The handle of the user.
 * @param {Object} updates - The updates to apply.
 * @throws {Error} Throws an error if updating the user status fails.
 * @returns {Promise<void>} Resolves when the status is updated successfully.
 */
export const updateUserStatus = async (handle, updates) => {
    try {
        await update(ref(db, `users/${handle}`), updates);
    } catch (error) {
        toast.error('Error updating user status:', error);
        throw error;
    }
};

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<Object>} A promise that resolves with the users data.
 * @throws {Error} Throws an error if fetching users fails.
 */
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

/**
 * Retrieves a user by their handle.
 *
 * @param {string} handle - The handle of the user.
 * @returns {Promise<Object>} A promise that resolves with the user data.
 */
export const getUserByHandle = async (handle) => {
    const snapshot = await get(ref(db, `users/${handle}`));
    return snapshot.val();
};

/**
 * Creates a new user record with the provided handle and details.
 *
 * @param {string} handle - The handle for the new user.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} uid - The user's UID.
 * @param {string} email - The user's email address.
 * @param {boolean} isAdmin - Whether the user is an admin.
 * @param {boolean} isBlocked - Whether the user is blocked.
 * @returns {Promise<void>} Resolves when the user is created successfully.
 */
export const createUserHandle = async (handle, firstName, lastName, uid, email, isAdmin, isBlocked) => {
    const user = { handle, firstName, lastName, uid, email, isAdmin, isBlocked, createdOn: new Date().toString() };
    await set(ref(db, `users/${handle}`), user);
};

/**
 * Retrieves user data based on the provided UID.
 *
 * @param {string} uid - The UID of the user.
 * @returns {Promise<Object>} A promise that resolves with the user data.
 */
export const getUserData = async (uid) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    return snapshot.val();
};

/**
 * Retrieves a user by their email address.
 *
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object>} A promise that resolves with the user data.
 */
export const getUserByEmail = async (email) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
    return snapshot.val();
};

/**
 * Updates the user's personal information in the database.
 *
 * @param {string} handle - The handle of the user.
 * @param {string} newEmail - The new email address of the user.
 * @param {string} firstName - The updated first name of the user.
 * @param {string} lastName - The updated last name of the user.
 * @throws {Error} Throws an error if updating the personal info fails.
 * @returns {Promise<void>} Resolves when the personal info is updated successfully.
 */
export const updateAccountInfoDB = async (handle, newEmail, firstName, lastName) => {
    try {
        await update(ref(db, `users/${handle}`), { email: newEmail, firstName, lastName });
    } catch (error) {
        toast.error('Error updating personal info:', error);
        throw new Error(error.message);
    }
};

/**
 * Updates the user's email address in Firebase Authentication.
 *
 * @param {Object} profileData - The profile data including the new email address.
 * @throws {Error} Throws an error if the user is not authenticated or if updating fails.
 * @returns {Promise<void>} Resolves when the email is updated successfully.
 */
export const updateEmailInAuth = async (profileData) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User is not authenticated');
    }

    try {
        if (profileData.email && profileData.email !== user.email) {
            await updateEmail(user, profileData.email);
        }

    } catch (error) {
        toast.error('Error updating user profile:', error);
        throw error;
    }
};
