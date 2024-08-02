import React from "react"
import "./Post.css"


const Post = () => {

    return (
        <>
        
        <div className="postContainer">
            <div className="userContainer">
                <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="profile-pic" 
                className="profilePic"
                />
                <div className="userInfo">
                    <h3 className="userName">Username</h3>
                    <p className="userType">User type: user {}</p>
                </div>
            </div>
            <p className="actualPost">The hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.</p>
            <div className="buttonContainer">
                <button className="postButton">Like</button>
                <button className="postButton">Comment</button>
            </div>
            
        </div>

        <div className="commentSection">
            <h2 className="commentsHeader">Comments</h2>
            <hr />
            <div className="singleComment">
                    <div className="userContainer">
                            <img 
                            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="profile-pic" 
                            className="profilePic"
                            />
                            <div className="userInfo">
                                <h3 className="userName">Username</h3>
                                <p className="userType">User type: admin{}</p>
                            </div>
                    </div>
                    <p className="actualComment">commencommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentcommentt</p>
                </div>
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
        </div>

        </>
    )

}






export default Post;

