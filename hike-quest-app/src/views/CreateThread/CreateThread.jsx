import { useContext, useState } from "react"
import { AppContext } from "../../state/app.context";
import { createThread } from "../../services/threads.service";
import { MAX_THREAD_CONTENT, MAX_THREAD_TITLE, MIN_THREAD_CONTENT, MIN_THREAD_TITLE } from "../../common/constants";
import { useNavigate } from "react-router-dom";
import '../../views/SingleThread/SingleThread.css'


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
      return alert('Title too short!');
    }
    if (thread.title.length > MAX_THREAD_TITLE) {
      return alert('Title too long!');
    }
    if (thread.content.length < MIN_THREAD_CONTENT) {
      return alert('Content too short!');
    }

    if (thread.content.length > MAX_THREAD_CONTENT) {
      return alert('Content too long!');
    }

    try {
      await createThread(userData.handle, thread.title.trim(), thread.content.trim());
      setThread({ title: '', content: '' });
      alert('Thanks for your contribution!');
      navigate('/threads')

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create thread</h1>
      <label className="createTitle" htmlFor="title">Title: </label>
      <input className="commentBox" placeholder="Add a title..." value={thread.title} onChange={e => updateThread('title', e.target.value)} type="text" name="title" id="title" /><br />
      <label className="createContent" htmlFor="content">Content: </label>
      <textarea className="commentBox" placeholder="Add content..." value={thread.content} onChange={e => updateThread('content', e.target.value)} name="content" id="content" /><br /><br />
      <button className="threadButtons" onClick={handleCreateThread}>Create</button>
    </div>
  )
}