import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteThread, getAllThreads } from "../../services/threads.service";
import { AppContext } from "../../state/app.context";
import { MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import styles from './AllThreads.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                setThreads(threads);
            } catch (error) {
                toast.error(error.message);
            }
        };

        loadThreads();
    }, [search, sort, userFilter]);

    //TODO confirm window

    const handleDeleteThread = async (threadId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
        if (confirmDelete) {
            try {
                await deleteThread(threadId);
                setThreads(threads.filter(thread => thread.id !== threadId));
            } catch (error) {
                toast.error('Error deleting thread:', error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Our Threads</h1>
            <div className={styles.filters}>
                <label htmlFor="sort" className={styles.label}>Sort by:</label>
                <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={styles.select}
                >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                </select>
            </div>
            <div className={styles.filters}>
                <label htmlFor="filter" className={styles.label}>Filter by user:</label>
                <input
                    id="filter"
                    type="text"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className={styles.input}
                />
            </div>
            {threads.length > 0 ? (
                threads.map(t => (
                    <div key={t.id} className={styles.threadItem}>
                        <p className={styles.threadHeader}>
                            <strong>{t.title}</strong> <br />
                        </p> by <label className="authorThread"> {t.author} </label>
                        <p className='threadDate'> {new Date(t.createdOn).toDateString()}</p>                        <p className={styles.threadContent}>
                            {t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...
                        </p>
                        <p className={styles.threadStats}>
                            Likes: {t.likeCount} | Comments: {t.commentCount}
                        </p>
                        <div className={styles.threadButtons}>
                            <button className={styles.button} onClick={() => navigate(`/threads/${t.id}`)}>See more</button>
                            {(t.author === userData?.handle || userData?.isAdmin) && (
                                <button className={styles.button} onClick={() => handleDeleteThread(t.id)}>Delete</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No threads</p>
            )}
        </div>
    );
}
