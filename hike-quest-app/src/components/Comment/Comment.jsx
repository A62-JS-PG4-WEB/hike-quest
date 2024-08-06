import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { addCommentToThread } from "../../services/threads.service";

export default function Comment({ thread }) {

    const { user, userData } = useContext(AppContext);
    const navigate = useNavigate();
    //console.log(thread);
    
    const [comment, setComment] = useState('');

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCreateComment = async () => {


        if (!comment.trim()) {
            return alert("Comment cannot be empty.");
        }

        try {
            await addCommentToThread(thread.id, {
                text: comment,
                author: userData.handle,
                createdOn: new Date().toISOString(),
            });
            setComment('');
            alert("Comment added successfully.");
            // console.log(thread);

        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    return (
        <>
            <div className="singleComment">
                <div className="userContainer">
                    <textarea
                        value={comment}
                        onChange={handleCommentChange}
                        name="comment"
                        id="comment"
                        placeholder="Write your comment here..."
                    /><br /><br />
                    <button onClick={handleCreateComment}>Comment</button>
                    <div className="userInfo">
                        <h3 className="userName">{userData ? userData.handle : "Username"}</h3>
                    </div>
                </div>
            </div>
        </>
    );
}

{/* <>
        <div className="singleComment">
                    <div className="userContainer">
                            <img 
                            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="profile-pic" 
                            className="profilePic"
                            />
                            <div className="userInfo">
                                <h3 className="userName">Username</h3>
                                <p className="userType">User type: {}</p>
                            </div>
                    </div>
                    <p className="actualComment">commencommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentt</p>
                </div>
        
        
        
        </> */}