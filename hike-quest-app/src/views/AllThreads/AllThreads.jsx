import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteThread, getAllThreads } from "../../services/threads.service";
import { AppContext } from "../../state/app.context";
import { MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";

export default function AllThreads() {
    const [threads, setThreads] = useState([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [sort, setSort] = useState('date');
    const [userFilter, setUserFilter] = useState('');
    const { userData } = useContext(AppContext);

    useEffect(() => {
        const loadThreads = async () => {
            try {
                const threads = await getAllThreads(search, sort, userFilter);
                console.log(threads);
                setThreads(threads);
            } catch (error) {
                alert(error.message);
            }
        };

        loadThreads();
    }, [search, sort, userFilter]);

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
    };

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
            {threads.length > 0 ? (
                threads.map(t => (
                    <div key={t.id} className="threadItem">
                        <p><strong>{t.title}</strong> by {t.author} <small>{new Date(t.createdOn).toDateString()}</small></p>
                        <p>{t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...</p>
                        <p>Likes: {t.likeCount} | Comments: {t.commentCount}</p>
                        <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button>
                        {(t.author === userData?.handle || userData?.isAdmin) && (
                            <>
                                <button onClick={() => handleDeleteThread(t.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                'No threads'
            )}
        </div>
    );
}