import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Thread from '../../components/Thread/Thread';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

export default function SingleThread() {
  const [thread, setThread] = useState(null);
  const { id } = useParams();
  console.log(thread);
  // useEffect(() => {
  //   getThreadById(id)
  //     .then(thread => setThread(thread))
  //     .catch(e => alert(e.message));
  // }, [id]);

  useEffect(() => {
    return onValue(ref(db, `threads/${id}`), snapshot => {
      const updatedThread = snapshot.val();
      setThread({
        ...updatedThread,
        likedBy: Object.keys(updatedThread.likedBy ?? {}),
      });
    })
  }, [id]);

  return (
    <div>
      <h1>Single thread</h1>
      {thread && <Thread thread={thread} />}
    </div>
  )
}