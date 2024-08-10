import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteThread, getAllThreads } from "../../services/threads.service";
import { AppContext } from "../../state/app.context";

/**
 * AllThreads component displays a list threads/posts, allowing users to sort,
 * filter, view, and delete threads (only admins/ author of post). It fetches all threads, 
 * also based on search parameters, sorting options, and user filters.
 *
 * @component
 * @example
 * return (
 *   <AllThreads />
 * )
 *
 * @returns {JSX.Element} The rendered AllThreads component.
 *
 * @typedef {Object} Thread
 * @property {string} id - The unique identifier of the thread.
 * @property {string} title - The title of the thread.
 * @property {string} author - The author of the thread.
 * @property {Date} createdOn - The date the thread was created.
 * @property {string} content - The content of the thread.
 *
 * @typedef {Object} UserData
 * @property {string} handle - The user's unique handle.
 * @property {boolean} isAdmin - Whether the user has admin privileges.
 */
export default function AllThreads() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [sort, setSort] = useState('date');
  const [userFilter, setUserFilter] = useState('');
  const { userData } = useContext(AppContext);

  /**
   * useEffect hook that loads threads from the server whenever
   * the search, sort, or userFilter state changes.
   */
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

  /**
   * Handles the deletion of a thread by its ID after confirming with the user.
   *
   * @async
   * @function
   * @param {string} threadId - The ID of the thread to delete.
   * @returns {Promise<void>}
   */

  const handleDeleteThread = async (threadId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
    if (confirmDelete) {
      try {

        await deleteThread(threadId);
        setThreads(threads.filter(thread => thread.id !== threadId));
      } catch (error) {
        console.error('Error deleting thread:', error);
      }
    }
  }

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
        ? threads.map(t => <p key={t.id}> <strong>{t.title} </strong> by {t.author} <small>{new Date(t.createdOn).toDateString()}</small> <br /><br />{t.content}... <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button>
          {(t.author === userData?.handle || userData?.isAdmin) && (
            <>
              <button onClick={() => handleDeleteThread(t.id)}>Delete</button>
            </>
          )}
        </p>)
        : 'No threads'
      }
    </div>
  )
}