import { useContext, useState } from "react"

import { AppContext } from "../../state/app.context";
import { createThread } from "../../services/threads.service";

export default function CreateThread() {
  const [thread, setThread] = useState({
    title: '',
    content: '',
  });
  const { userData } = useContext(AppContext);
console.log('thread create ');

  const updateThread = (key, value) => {
    setThread({
      ...thread,
      [key]: value,
    });
  };

  const handleCreateThread = async () => {
    if (thread.title.length < 3) {
      return alert('Title too short!');
    }
    if (thread.content.length < 3) {
      return alert('Content too short!');
    }
//userData.handle,
    try {
      await createThread ( thread.title, thread.content);
      setThread({ title: '', content: '' }); 
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create thread</h1>
      <label htmlFor="title">Title: </label>
      <input value={thread.title} onChange={e => updateThread('title', e.target.value)} type="text" name="title" id="title" /><br/>
      <label htmlFor="content">Content: </label>
      <textarea value={thread.content} onChange={e => updateThread('content', e.target.value)} name="content" id="content" /><br/><br/>
      <button onClick={handleCreateThread}>Create</button>
    </div>
  )
}