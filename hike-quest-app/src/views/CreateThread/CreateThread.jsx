import { useContext, useState } from "react"
import { AppContext } from "../../state/app.context";
import { createThread } from "../../services/threads.service";
import { MAX_THREAD_CONTENT, MAX_THREAD_LOCATION, MAX_THREAD_TITLE, MIN_THREAD_CONTENT, MIN_THREAD_LOCATION, MIN_THREAD_TITLE } from "../../common/constants";
import { useNavigate } from "react-router-dom";
import '../../views/SingleThread/SingleThread.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/**
 * CreateThread component allows users to create a new discussion thread by entering
 * a title and content. The component validates the input before submitting the thread.
 *
 * @component
 * @example
 * return (
 *   <CreateThread />
 * )
 *
 * @returns {JSX.Element} The rendered CreateThread component.
 *
 * @typedef {Object} Thread
 * @property {string} title - The title of the thread.
 * @property {string} content - The content of the thread.
 *
 * @typedef {Object} UserData
 * @property {string} handle - The user's unique handle.
 */
export default function CreateThread() {
  const [thread, setThread] = useState({
    title: '',
    content: '',
    location: ''
  });
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  /**
   * Updates the thread state with the provided key and value.
   *
   * @param {string} key - The key of the thread object to update.
   * @param {string} value - The value to set for the specified key.
   */
  const updateThread = (key, value) => {
    setThread({
      ...thread,
      [key]: value,
    });
  };

  /**
   * Handles the creation of a new thread, validating the input and
   * submitting the thread to the server.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */

  const handleCreateThread = async () => {
    if (thread.title.length < MIN_THREAD_TITLE) {
      return toast.error('Title too short!');
    }
    if (thread.title.length > MAX_THREAD_TITLE) {
      return toast.error('Title too long!');
    }
    if (thread.content.length < MIN_THREAD_CONTENT) {
      return toast.error('Content too short!');
    }

    if (thread.content.length > MAX_THREAD_CONTENT) {
      return toast.error('Content too long!');
    }

    if (thread.location.length < MIN_THREAD_LOCATION) {
      return toast.error('Location name too short!');
    }
    if (thread.location.length > MAX_THREAD_LOCATION) {
      return toast.error('Location name too short!');
    }

    try {
      await createThread(userData.handle, thread.title.trim(), thread.content.trim(), thread.location.trim());
      setThread({ title: '', content: '', location: '' });
      toast.info('Thanks for your contribution!');
      navigate('/threads')

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="createThreadContainer">
      <h1 className="createThreadTitle">Create Thread</h1>

      <label className="createThreadLabel" htmlFor="title">Title:</label>
      <input className="createThreadInput" placeholder="Add a title..." value={thread.title} onChange={e => updateThread('title', e.target.value)} type="text" name="title" id="title" />

      <label className="createThreadLabel" htmlFor="content">Content:</label>
      <textarea className="createThreadTextarea" placeholder="Add content..." value={thread.content} onChange={e => updateThread('content', e.target.value)} name="content" id="content"></textarea>

      <label className="createLocationLabel" htmlFor="location">Hike Location:</label>
      <input className="createLocationInput" placeholder="Enter location..." value={thread.location} onChange={e => updateThread('location', e.target.value)} name="location" id="location" />

      <button className="createThreadButton" onClick={handleCreateThread}>Create</button>
    </div>

  )
}