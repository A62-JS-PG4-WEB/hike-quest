import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllThreads } from "../../services/threads.service";

export default function AllThreads() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';


  useEffect(() => {
    getAllThreads(search)
      .then(threads => setThreads(threads))
      .catch(error => alert(error.message));
   
  }, [search]);


  return (
    <div>
      <h1>Our Threads</h1>
      {threads.length > 0
      ? threads.map(t => <p key={t.id}> <strong>{t.title}</strong> <br /><br />{t.content}... <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button></p>)
      : 'No threads'
      }
    </div>
  )
}