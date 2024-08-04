import React from "react"
import Comment from "../../components/Comment/Comment"
import "./SingleThread.css"


const SingleThread = () => {

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
                        <p className="userType">User type: user { }</p>
                    </div>
                </div>
                <p className="actualPost">The hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.he hike around Everest was an amazing Journey. Made me feel like a god over the world when I got to the peek.</p>
                <div className="buttonContainer">
                    <button className="postButtons">Like</button>
                    <button className="postButtons">Comment</button>
                </div>

            </div>

            <div className="commentSection">
                <h2 className="commentsHeader">Comments</h2>
                <hr />
                <Comment />
                <Comment />
                <Comment />
                <Comment />

            </div>

        </>
    )

}






export default SingleThread;

