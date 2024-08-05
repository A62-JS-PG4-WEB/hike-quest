import { useContext, useState } from "react"
import { AppContext } from "../../state/app.context";
import { createThread } from "../../services/threads.service";
import { MAX_THREAD_CONTENT, MAX_THREAD_TITLE, MIN_THREAD_CONTENT, MIN_THREAD_TITLE } from "../../common/constants";

export default function CreateThread() {
  const [thread, setThread] = useState({
    title: '',
    content: '',
  });
  const { userData } = useContext(AppContext);


  const updateThread = (key, value) => {
    setThread({
      ...thread,
      [key]: value,
    });
  };

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
    //userData.handle,
    try {
      await createThread(  userData.handle, thread.title, thread.content);
     console.log('createThread ' , userData.handle );
      setThread({ title: '', content: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create thread</h1>
      <label htmlFor="title">Title: </label>
      <input value={thread.title} onChange={e => updateThread('title', e.target.value)} type="text" name="title" id="title" /><br />
      <label htmlFor="content">Content: </label>
      <textarea value={thread.content} onChange={e => updateThread('content', e.target.value)} name="content" id="content" /><br /><br />
      <button onClick={handleCreateThread}>Create</button>
    </div>
  )
}