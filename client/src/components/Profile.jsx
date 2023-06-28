import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Post } from './Feed'
import Loader from './Loader'

// PROFILE SECTION FOR BOTH USERS AND CURRENT USER LOGGED
// ADD LOGIC IN COMPONENTS AS "EDIT PROFILE" OR "FOLLOW" WHICH THE CASE IS.

const UserProfile = () => {

    const { logged, user, getPosts, posts, loader, deleteUser, errMsg } = useContext(AppContext)
    const [personalProfile, setPersonalProfile] = useState()

    const { userParam } = useParams()

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <>
            <div>@{userParam}'s profile</div>

            {loader && <Loader />}

            {
                !loader && posts.length > 0 && posts.filter(post => post.username === userParam).map((el, i) => {
                    return (
                        <Post
                            key={i}
                            version={el.__v}
                            postID={el._id}
                            profileImage={el.profileImage}
                            fullname={el.fullname}
                            username={el.username}
                            date={el.date}
                            description={el.description}
                            filesContent={el.filesContent}
                            likes={el.likes}
                            comments={el.comments}
                            shared={el.shared}
                            saved={el.saved}
                        />
                    )
                })
            }

            {userParam === user.username && <button onClick={() => deleteUser(user.username)} className='p-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400'>DELETE USER</button>}

            {errMsg.length > 0 && <span>{errMsg}</span>}
        </>
    )
}

export default UserProfile