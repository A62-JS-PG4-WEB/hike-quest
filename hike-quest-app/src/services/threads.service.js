import { ref, push, get, set, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MAX_TAGS_COUNT } from '../common/constants';


/**
 * Deletes a comment from a specific thread.
 * 
 * @param {string} threadId - The ID of the thread containing the comment.
 * @param {string} commentId - The ID of the comment to delete.
 * @returns {Promise<void>} A promise that resolves when the comment is deleted.
 */
export const deleteCommentFromThread = async (threadId, commentId) => {
  const commentRef = ref(db, `threads/${threadId}/comments/${commentId}`);
  await remove(commentRef);
};

/**
 * Updates the text of a comment in a specific thread.
 * 
 * @param {string} threadId - The ID of the thread containing the comment.
 * @param {string} commentId - The ID of the comment to update.
 * @param {string} updatedText - The new text for the comment.
 * @returns {Promise<void>} A promise that resolves when the comment is updated.
 */
export const updateCommentInThread = async (threadId, commentId, updatedText) => {
  const commentRef = ref(db, `threads/${threadId}/comments/${commentId}`);
  await update(commentRef, { text: updatedText });
};

/**
 * Creates a new thread in the database.
 * 
 * @param {string} author - The handle of the thread's author.
 * @param {string} title - The title of the thread.
 * @param {string} content - The content of the thread.
 * @param {string} location - The location related to the thread.
 * @returns {Promise<void>} A promise that resolves when the thread is created.
 */
export const createThread = async (author, title, content, location) => {
  const thread = { author, title, content, createdOn: new Date().toString(), location };
  const result = await push(ref(db, 'threads'), thread);
  const id = result.key;

  await update(ref(db), {
    [`threads/${id}/id`]: id,
  });
};

/**
 * Retrieves the count of all threads.
 * 
 * @returns {Promise<number>} The number of threads.
 */
export const getThreadsCount = async () => {
  const snapshot = await get(ref(db, 'threads'));
  const threads = Object.values(snapshot.val());
  return threads.length;
};

/**
 * Retrieves the count of all users.
 * 
 * @returns {Promise<number>} The number of users.
 */
export const getUsersCount = async () => {
  const snapshot = await get(ref(db, 'users'));
  const users = Object.values(snapshot.val());
  return users.length;
};

/**
 * Retrieves all threads, optionally filtered by search, user, or sorted.
 * 
 * @param {string} [search=''] - The search query to filter threads by title.
 * @param {string} [sort=''] - The sorting criterion ('date' or 'title').
 * @param {string} [userFilter=''] - The user handle to filter threads by author.
 * @returns {Promise<Array<Object>>} An array of threads matching the criteria.
 */
export const getAllThreads = async (search = '', sort = '', userFilter = '') => {
  const snapshot = await get(ref(db, 'threads'));
  if (!snapshot.exists()) return [];

  const threads = Object.values(snapshot.val())
    .map(thread => ({
      ...thread,
      commentCount: thread.comments ? Object.keys(thread.comments).length : 0,
      likeCount: thread.likedBy ? Object.keys(thread.likedBy).length : 0,
    }));

  if (search) {
    return threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (userFilter) {
    return threads.filter(t => t.author.toLowerCase().includes(userFilter.toLowerCase()));
  }

  if (sort === 'date') {
    return threads.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
  } else if (sort === 'title') {
    return threads.sort((a, b) => a.title.localeCompare(b.title));
  }
  return threads;
};

/**
 * Retrieves a thread by its ID.
 * 
 * @param {string} id - The ID of the thread to retrieve.
 * @returns {Promise<Object>} The thread object.
 * @throws {Error} Throws an error if the thread is not found.
 */
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

/**
 * Likes a thread for a specific user.
 * 
 * @param {string} handle - The handle of the user liking the thread.
 * @param {string} threadId - The ID of the thread to like.
 * @returns {Promise<void>} A promise that resolves when the thread is liked.
 */
export const likeThread = (handle, threadId) => {
  const updateObject = {
    [`threads/${threadId}/likedBy/${handle}`]: true,
    [`users/${handle}/likedThreads/${threadId}`]: true,
  };
  toast.success('Liked');
  return update(ref(db), updateObject);
};

/**
 * Dislikes a thread for a specific user.
 * 
 * @param {string} handle - The handle of the user disliking the thread.
 * @param {string} threadId - The ID of the thread to dislike.
 * @returns {Promise<void>} A promise that resolves when the thread is disliked.
 */
export const dislikeThread = (handle, threadId) => {
  const updateObject = {
    [`threads/${threadId}/likedBy/${handle}`]: null,
    [`users/${handle}/likedThreads/${threadId}`]: null,
  };

  return update(ref(db), updateObject);
};

/**
 * Deletes a thread by its ID.
 * 
 * @param {string} threadId - The ID of the thread to delete.
 * @returns {Promise<void>} A promise that resolves when the thread is deleted.
 * @throws {Error} Throws an error if there is a problem deleting the thread.
 */
export const deleteThread = async (threadId) => {
  try {
    const threadRef = ref(db, `threads/${threadId}`);
    await remove(threadRef);
    await remove(ref(db, `posts/${threadId}`));
    toast.success('Thread deleted successfully.');
  } catch (error) {
    toast.error('Error deleting thread: ' + error.message || error);
    throw error;
  }
};

/**
 * Subscribes to changes in the threads and provides a callback with the updated count.
 * 
 * @param {Function} callback - The function to call with the updated thread count.
 * @returns {Function} A function to unsubscribe from the changes.
 */
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

/**
 * Adds a comment to a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to add a comment to.
 * @param {Object} comment - The comment to add.
 * @param {string} comment.text - The text of the comment.
 * @param {string} comment.author - The handle of the comment's author.
 * @returns {Promise<void>} A promise that resolves when the comment is added.
 */
export const addCommentToThread = async (threadId, comment) => {
  try {
    const commentsRef = push(ref(db, `threads/${threadId}/comments`));
    const commentData = {
      ...comment,
      createdOn: new Date().toString()
    };

    await set(commentsRef, commentData);
  } catch (error) {
    toast.error('Error adding comment:', error);
  }
};

/**
 * Retrieves comments for a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to get comments for.
 * @returns {Promise<Array<Object>>} An array of comments for the thread.
 */
export const getCommentsByThread = async (threadId) => {
  try {
    const snapshot = await get(ref(db, `threads/${threadId}/comments`));
    if (!snapshot.exists()) return [];

    const comments = Object.entries(snapshot.val()).map(([id, props]) => ({ id, ...props }));
    return comments;
  } catch (error) {
    toast.error(`Error getting comments for ${threadId} :`, error);
  }
};

/**
 * Retrieves the count of tags for a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to get tag count for.
 * @returns {Promise<number>} The number of tags for the thread.
 */
export const getTagCount = async (threadId) => {
  try {
    const snapshot = await get(ref(db, `posts/${threadId}`));
    const tags = snapshot.val();

    if (!tags) {
      return 0;
    }

    const tagCount = Object.values(tags).length;
    return tagCount;
  } catch (error) {
    toast.error("Error creating tag:", error);
  }
};

/**
 * Creates a new tag and associates it with a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to associate the tag with.
 * @param {string} tag - The name of the tag to create.
 * @returns {Promise<string|undefined>} The ID of the newly created tag, or undefined if no tag was created.
 */
export const createTag = async (threadId, tag) => {
  if (!tag.trim()) {
    return;
  }
  const count = await getTagCount(threadId);
  if (count > MAX_TAGS_COUNT) {
    toast.warning('Tag limit exceeded (10)!');
    return;
  }
  const allTags = await fetchAllTags();
  const existingTagEntry = Object.entries(allTags).find(([name]) => name === tag.trim());
  const existingTagId = existingTagEntry ? existingTagEntry[0] : null;

  if (existingTagId) {
    const allPosts = await fetchAllPosts(threadId);
    const existingTagPost = allPosts.includes(existingTagId);

    if (existingTagPost) {
      return;
    } else {
      await update(ref(db), {
        [`posts/${threadId}/${existingTagId}`]: true,
      });
    }
  } else {
    try {
      const tagRef = push(ref(db, 'tags'), tag.trim());
      const tagId = tagRef.key;

      await update(ref(db), {
        [`posts/${threadId}/${tagId}`]: true,
      });

      return tagId;
    } catch (error) {
      toast.error("Error creating tag:", error);
      throw error;
    }
  }
};

/**
 * Fetches all tags from the database.
 * 
 * @returns {Promise<Object>} An object mapping tag IDs to tag names.
 */
const fetchAllTags = async () => {
  const snapshot = await get(ref(db, 'tags'));
  return snapshot.exists() ? snapshot.val() : {};
};

/**
 * Fetches all post IDs associated with a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to fetch posts for.
 * @returns {Promise<Array<string>>} An array of tag IDs associated with the thread.
 */
const fetchAllPosts = async (threadId) => {
  const snapshot = await get(ref(db, `posts/${threadId}`));
  return snapshot.exists() ? Object.keys(snapshot.val()) : [];
};

/**
 * Retrieves tags associated with a specific post.
 * 
 * @param {string} threadId - The ID of the thread to get tags for.
 * @returns {Promise<Array<Object>>} An array of tag objects associated with the post.
 */
export const fetchTagsForPost = async (threadId) => {
  const postSnapshot = await get(ref(db, `posts/${threadId}`));

  if (!postSnapshot.exists()) {
    return [];
  }

  const tagIds = Object.keys(postSnapshot.val());
  const tagsSnapshot = await get(ref(db, 'tags'));

  if (!tagsSnapshot.exists()) {
    return [];
  }

  const allTags = tagsSnapshot.val();
  const tagsForPost = tagIds.map(tagId => ({
    id: tagId,
    name: allTags[tagId]
  }));

  return tagsForPost;
};

/**
 * Retrieves posts associated with a specific tag in a thread.
 * 
 * @param {string} threadId - The ID of the thread to get posts for.
 * @param {string} tagId - The ID of the tag to fetch posts for.
 * @returns {Promise<Object>} An object mapping post IDs to their values.
 */
export const fetchPostsByTag = async (threadId, tagId) => {
  const postRef = ref(db, `posts/${threadId}/${tagId}`);
  const snapshot = await get(postRef);
  const result = snapshot.val();

  return result;
};

/**
 * Deletes a tag from a specific thread.
 * 
 * @param {string} threadId - The ID of the thread to remove the tag from.
 * @param {string} tagId - The ID of the tag to delete.
 * @returns {Promise<void>} A promise that resolves when the tag is deleted.
 */
export const deleteTag = async (threadId, tagId) => {
  const tagRef = ref(db, `posts/${threadId}/${tagId}`);
  await remove(tagRef);
};

