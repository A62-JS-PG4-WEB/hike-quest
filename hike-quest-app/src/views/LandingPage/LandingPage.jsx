import { useEffect, useState } from "react";
import { getAllThreads } from "../../services/threads.service";
import { useNavigate } from "react-router-dom";
import { COUNT_THREADS_LANDINGPAGE, MAX_CONTENT_TO_SHOW, MIN_CONTENT_TO_SHOW } from "../../common/constants";
import styles from "./LandingPage.module.css"

export default function LandingPage() {
    const [threads, setThreads] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadThreads = async () => {
            try {
                const threads = await getAllThreads('', 'date', '');
                setThreads(threads);
            } catch (error) {
                alert(error.message);
            }
        };

        loadThreads();
    }, []);

    const sortedThreads = [...threads].sort((a, b) => b.commentCount - a.commentCount);

    return (
        <div className={styles.container}>
            {threads.length > 0 ? (
                <>
                    <div>
                        <h1 className={styles.title}>Our most pertinent Threads</h1>
                        {sortedThreads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                            <div key={t.id} className={styles.threadItem}>
                                <p className={styles.threadHeader}>
                                    <strong>{t.title}</strong>
                                   
                                </p>
                                <p className='threadDate'> {new Date(t.createdOn).toDateString()}</p>
                                                    <p className={styles.threadContent}>
                                    {t.content.slice(MIN_CONTENT_TO_SHOW, MAX_CONTENT_TO_SHOW)}...
                                </p>
                                <div className={styles.threadButtons}>
                                    <button className={styles.button} onClick={() => navigate(`/login`)}>See more</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h1 className={styles.title}>Newest Threads</h1>
                        {threads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                            <div key={t.id} className={styles.threadItem}>
                                <p className={styles.threadHeader}>
                                    <strong>{t.title}</strong>
                                </p>
                                <p className='threadDate'> {new Date(t.createdOn).toDateString()}</p>
                                <p className={styles.threadContent}>
                                    {t.content.slice(0, 300)}...
                                </p>
                                <div className={styles.threadButtons}>
                                    <button className={styles.button} onClick={() => navigate(`/login`)}>See more</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className={styles.threadStats}>
                    Join us to share your most awesome experience!
                </p>
            )}
        </div>
    );
}
