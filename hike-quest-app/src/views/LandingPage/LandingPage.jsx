import { useEffect, useState } from "react";
import { getAllThreads } from "../../services/threads.service";
import { useNavigate } from "react-router-dom";
import { COUNT_THREADS_LANDINGPAGE, MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import styles from "./LandingPage.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandingPage() {
    const [threads, setThreads] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadThreads = async () => {
            try {
                const threads = await getAllThreads('', 'date', '');
                setThreads(threads);
            } catch (error) {
                toast.error(error.message);
            }
        };

        loadThreads();
    }, []);

    const sortedThreads = [...threads].sort((a, b) => b.commentCount - a.commentCount);

    return (
        <div className={styles.threadsPageContainer}>
            {threads.length > 0 ? (
                <>
                    <div className={styles.threadSectionsContainer}>
                        <section className={styles.threadsColumn}>
                            <h1 className={styles.sectionTitle}>Our Most Popular Threads</h1>
                            {sortedThreads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                                <div key={t.id} className={styles.threadCard}>
                                    <p className={styles.threadTitle}><strong>{t.title}</strong></p>
                                    <p className={styles.threadDate}>{new Date(t.createdOn).toDateString()}</p>
                                    <p className={styles.threadExcerpt}>
                                        {t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...
                                    </p>
                                    <div className={styles.threadActions}>
                                        <button className={styles.viewMoreButton} onClick={() => navigate(`/login`)}>See More</button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className={styles.threadsColumn}>
                            <h1 className={styles.sectionTitle}>Most Recent Threads</h1>
                            {threads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                                <div key={t.id} className={styles.threadCard}>
                                    <p className={styles.threadTitle}><strong>{t.title}</strong></p>
                                    <p className={styles.threadDate}>{new Date(t.createdOn).toDateString()}</p>
                                    <p className={styles.threadExcerpt}>
                                        {t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...
                                    </p>
                                    <div className={styles.threadActions}>
                                        <button className={styles.viewMoreButton} onClick={() => navigate(`/login`)}>See More</button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </>
            ) : (
                <p className={styles.noThreadsMessage}>
                    Join us to share your most awesome experience!
                </p>
            )}
        </div>




    );
}
