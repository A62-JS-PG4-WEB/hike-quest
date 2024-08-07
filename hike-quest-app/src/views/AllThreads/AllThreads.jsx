import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllThreads } from "../../services/threads.service";

export default function AllThreads() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [sort, setSort] = useState('date');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const threads = await getAllThreads(search, sort, userFilter);
        setThreads(threads);
      } catch (error) {
        alert(error.message);
      }
    };

    loadThreads();
  }, [search, sort, userFilter]);

  return (
    <div>
      <h1>Our Threads</h1>
      <div>
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter">Filter by user:</label>
        <input
          id="filter"
          type="text"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
      </div>
      {threads.length > 0
        ? threads.map(t => <p key={t.id}> <strong>{t.title} </strong> by {t.author} <small>{new Date(t.createdOn).toDateString()}</small> <br /><br />{t.content}... <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button></p>)
        : 'No threads'
      }
    </div>
  )
}