import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteThread, getAllThreads } from "../../services/threads.service";
import { AppContext } from "../../state/app.context";
import { MAX_CONTENT_TO_SHOW_LOGGED, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import styles from './AllThreads.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import '../../views/SingleThread/SingleThread.css'
import ThumbsUpOutline from "../../components/icons/ThumbsUpOutline";
import CommentsIcon from '../../components/icons/CommentsIcon';

/**
 * Component that displays a list of all threads. 
 * Users can sort threads by date or title, filter them by author, 
 * and delete threads if they are the author or an admin.
 *
 * @component
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
     * Loads threads based on search, sort, and user filter criteria.
     */
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

    /**
     * Deletes a thread.
     *
     * @param {string} threadId - The ID of the thread to delete.
     */

    const handleDeleteThread = async (threadId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(99, 236, 112)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                await deleteThread(threadId);
                setThreads(threads.filter(thread => thread.id !== threadId));
            } catch (error) {
                toast.error('Error deleting thread: ' + error.message || error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Our Threads</h1>
            <div className={styles.filtersContainer}>
                <div className={styles.filter}>
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
                <div className={styles.filter}>
                    <label htmlFor="filter" className={styles.label}>Filter:</label>
                    <input
                        id="filter"
                        type="text"
                        value={userFilter}
                        placeholder="Search by username"
                        onChange={(e) => setUserFilter(e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>
            {threads.length > 0 ? (
                threads.map(t => (
                    <div key={t.id} className={styles.threadItem}>
                        <h2 className={styles.threadHeader}>{t.title}</h2>
                        <p className={styles.threadContent}>
                            {t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW_LOGGED)}...
                        </p>
                        <div className={styles.threadStatsContainer}>
                            <p className={styles.threadStats}>
                                <ThumbsUpOutline /> {t.likeCount} | <CommentsIcon /> {t.commentCount}
                            </p>
                            <div className={styles.threadSmallInfo}>
                                <p className={styles.threadMeta}>
                                    Created by: {t.author} | {new Date(t.createdOn).toDateString()}
                                </p>
                                <div className={styles.threadButtons}>
                                    <button className={styles.button} onClick={() => navigate(`/threads/${t.id}`)}>See more</button>
                                    {(t.author === userData?.handle || userData?.isAdmin) && (
                                        <button className={styles.button} onClick={() => handleDeleteThread(t.id)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className={styles.separator} />
                    </div>
                ))
            ) : (
                <p className={styles.noThreads}>No threads available</p>
            )}
        </div>
    )
}
