import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Thread from '../../components/Thread/Thread';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import Comments from "../../components/Comments/Comments";

export default function SingleThread() {
    const [thread, setThread] = useState(null);
    const { id } = useParams();

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
            {thread && <Comments threadId={id} />}
        </div>
    )
}
















// import React, { useState, useEffect, useContext } from "react"
// import { useParams } from "react-router-dom"
// import { AppContext } from '../../state/app.context';
// import Comment from "../../components/Comment/Comment"
// import { getThreadById, likeThread, dislikeThread } from "../../services/threads.service"
// import "./SingleThread.css"


// const SingleThread = () => {
//     const [thread, setThread] = useState(null);
//     const [likedBy, setLikedBy] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { threadId } = useParams();

//     const { userData } = useContext(AppContext);

//     useEffect(() => {
//         getThreadById(threadId)
//             .then((res) => {
//                 setLikedBy(res.likedBy);
//                 setThread(res);
//                 setLoading(false);
//             });
//     }, [threadId])

//     const like = async () => {
//         if (!userData) return;

//         if (likedBy.includes(userData.handle)) {
//             await dislikeThread(userData.handle, thread.id)
//             setLikedBy([...likedBy.filter(l => l !== userData.handle)]);
//         } else {
//             await likeThread(userData.handle, thread.id);
//             setLikedBy([...likedBy, userData.handle]);
//         }
//     }

//     if (loading) return;

//     return (
//         <>
//             <div className="threadContainer">
//                 <div className="userContainer">
//                     <img
//                         src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
//                         alt="profile-pic"
//                         className="profilePic"
//                     />
//                     <div className="userInfo">
//                         <h3 className="userName">{thread.handle}</h3>
//                         {/* <p className="userType">User type: user { }</p> */}
//                     </div>
//                 </div>
//                 <p className="actualThread">{thread.content}</p>
//                 <div className="buttonContainer">
//                     <button className="threadButtons" onClick={like} disabled={!userData}>{userData && likedBy.includes(userData.handle) ? "Liked" : "Like"}</button>
//                     <p>Likes: ({likedBy.length})</p>
//                 </div>

//             </div >

//             <div className="commentSection">
//                 <h2 className="commentsHeader">Comments</h2>
//                 <hr />
//                 <Comment />
//                 <Comment />
//                 <Comment />
//                 <Comment />

//             </div>

//         </>
//     )

// }






// export default SingleThread;

