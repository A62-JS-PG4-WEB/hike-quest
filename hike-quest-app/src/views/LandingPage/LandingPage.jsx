import { useEffect, useState } from "react";
import { getAllThreads } from "../../services/threads.service";
import { useNavigate } from "react-router-dom";
import { COUNT_THREADS_LANDINGPAGE } from "../../common/constants";

export default function LandingPage() {
    const [threads, setThreads] = useState([]);
    const [comments, setComments] = useState([])
    const navigate = useNavigate()

    console.log(threads);

    useEffect(() => {
        const loadThreads = async () => {
            try {
                const threads = await getAllThreads('','date','');
                setThreads(threads);

    
            } catch (error) {
                alert(error.message);
            }
        };

        loadThreads();
    }, []);

    // useEffect(() => {
    //     const loadComments = async () => {
    //         try {
    //             const threads = await getAllComments(threadID);

    //             setComments(threads);
    //         } catch (error) {
    //             alert(error.message);
    //         }
    //     };

    //     loadComments();
    // }, []);

 
   // console.log(comments);

    return (
        <div >
            <div>
            {threads.length > 0 ? (
                <div>
                    <h1 >Our most pertinent Threads</h1>
                    {threads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                        <p key={t.id}>
                            <strong>{t.title}</strong>
                            
                            <br /><br />{t.content.slice(0, 300)}...
                            <button onClick={() => navigate(`/login`)}>See more</button>
                        </p>
                    ))}
                </div>
            ) : (
                'Join us to share your most awesome experience!'
            )}
               
            </div>
            {threads.length > 0 ? (
                <div>
                    <h1>Newest Threads</h1>
                    {threads.slice(0, COUNT_THREADS_LANDINGPAGE).map(t => (
                        <p key={t.id}>
                            <strong>{t.title}</strong>
                            <br /><br />{t.content.slice(0, 300)}...
                            <button onClick={() => navigate(`/login`)}>See more</button>
                        </p>
                    ))}
                </div>
            ) : (
                'Join us to share your most awesome experiences!'
            )}
        </div>
    )
}
