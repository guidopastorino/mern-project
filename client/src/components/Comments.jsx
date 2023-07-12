import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import ReactDOM from 'react-dom'
import { IoMdClose } from 'react-icons/io'
import Loader from './Loader'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Time from './Time'
import axios from 'axios'
import { BsThreeDots } from 'react-icons/bs'
import DropdownMenu from './DropdownMenu'
import HashWords from './HashWords'

const Comments = () => {

    const formRef = useRef()

    const { SERVER_URL, commentsModal, setCommentsModal, postComments, setPostComments, getPostComments, user, postCommentsID, setPostCommentsID, commentsLoader, setCommentsLoader } = useContext(AppContext)



    // 
    useEffect(() => {
        if (commentsModal) {
            document.querySelector("#root").classList.add("brightness-75", "pointer-events-none")
            document.querySelector("body").classList.add("overflow-hidden")
        } else {
            document.querySelector("#root").classList.remove("brightness-75", "pointer-events-none")
            document.querySelector("body").classList.remove("overflow-hidden")
        }
    }, [commentsModal])

    const btnModalRef = useRef()
    const ModalRef = useRef()

    useEffect(() => {
        let handler = e => {
            if (e.target === btnModalRef.current) return;
            if (commentsModal) {
                if (!ModalRef.current.contains(e.target)) {
                    setCommentsModal(false)
                }
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    })

    // comment to send
    function sendComment(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('profileImage', user.profileImage)
        formData.append('username', user.username)
        formData.append('comment', formRef.current.comment.value)

        axios.post(`${SERVER_URL}/api/make-comment/${postCommentsID}`, formData)
            .then(() => {
                getPostComments(postCommentsID)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getPostComments(postCommentsID)
    }, [])

    return (
        <>
            {commentsModal && <>
                {
                    ReactDOM.createPortal(
                        <div ref={ModalRef} className='w-full max-w-[500px] bg-white rounded-md shadow-lg fixed top-24 left-1/2 translate-x-[-50%] z-50 overflow-y-auto max-h-[70vh]'>
                            <div className='sticky z-50 top-0 bg-white p-4 border-b flex justify-between items-center gap-2'>
                                <span className='font-medium text-lg'>Comments</span>
                                <button ref={btnModalRef} onClick={() => setCommentsModal(!commentsModal)} className='p-1 rounded-sm hover:bg-gray-200 active:bg-gray-300 text-xl'><IoMdClose /></button>
                            </div>
                            <div>
                                {commentsLoader && <CommentsLoader />}

                                {
                                    !commentsLoader && postComments && postComments.length < 1
                                        ? <span className='text-center block text-slate-600 p-5'>No comments yet</span>
                                        : postComments.map((el, i) => (
                                            <Comment
                                                profileImage={el.profileImage}
                                                username={el.username}
                                                date={el.date}
                                                comment={el.comment}
                                                likes={el.likes}
                                                replies={el.replies}
                                                key={i}
                                            />
                                        ))
                                }


                            </div>
                            <form onSubmit={(e) => sendComment(e)} ref={formRef} className='w-full w-hite border-t p-2 flex justify-center items-center gap-2 sticky bottom-0 bg-white'>
                                <img className='w-10 h-10 rounded-full object-cover' src={`${SERVER_URL}/uploads/profile-images/${user.profileImage}`} alt="profile image" />
                                <input className='flex-1 p-2 border rounded-sm outline-none text-sm' type="text" name='comment' placeholder='Add a comment' />
                                <button type='submit'>Send</button>
                            </form>
                        </div>,
                        document.body
                    )
                }
            </>}
        </>
    )
}

export default Comments



const Comment = ({ profileImage, username, date, comment, replies, likes }) => {

    const [showReplies, setShowReplies] = useState(false)

    const { SERVER_URL, user, copyToClipboard } = useContext(AppContext)

    const [liked, setLiked] = useState(false)


    return (
        <div className='flex justify-center items-start gap-2 p-4 border-t'>
            <Link to={`/${username}`} className='shrink-0'>
                <img className='w-10 h-10 rounded-full object-cover' src={`${SERVER_URL}/uploads/profile-images/${profileImage}`} alt='profile image' />
            </Link>
            <div className='flex-1 flex justify-start items-start gap-2 flex-col'>
                <div className='flex justify-center items-center gap-1 text-xs text-slate-600'>
                    <Link to={`/${username}`} className='hover:underline'>@{username}</Link>
                    <span>&#8226;</span>
                    <Time timestamp={date} />
                </div>
                <div className='text-slate-800 text-sm break-all'>
                    <HashWords text={comment} />
                </div>
                {
                    replies.length > 0 && <div onClick={() => setShowReplies(!showReplies)} className='hover:opacity-75 active:opacity-50 w-full text-xs cursor-pointer text-slate-600 flex justify-start items-center gap-2'>
                        {
                            showReplies
                                ? <span>Hide replies</span>
                                : <span className='shrink-0'>Show {replies.length} {replies.length > 0 ? "replies" : "reply"}</span>
                        }
                        <hr className='w-1/2 border-slate-600 rounded-full' />
                    </div>
                }
                {
                    showReplies && replies.map((el, i) => (
                        <ReplyToComment
                            profileImage={"profileImage-1687790061741-330361736.jpg"}
                            username={"guido"}
                            date={Date.now()}
                            comment={"JAJAJAJAJAJAJJA"}
                            likes={[]}
                        />
                    ))
                }
            </div>


            <div className='flex flex-col gap-2 justify-center items-center'>
                <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef, top, setTop) => (
                    <>
                        <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu && 'bg-gray-200'} w-5 h-5 text-xs active:bg-gray-300 flex justify-center items-center rounded-full hover:bg-gray-200`}><BsThreeDots /></button>

                        {menu && <div ref={MenuRef} className={`${top ? "bottom-[130%]" : "top-[130%]"} z-40 shadow-lg w-max absolute right-0 bg-white border [&>ul>li]:p-2 text-xs [&>ul>li]:cursor-pointer`}>
                            <ul>
                                {
                                    user.username === username
                                        ? <>
                                            <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => copyToClipboard(comment)}>Copy comment</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Edit</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Delete</li>
                                        </>
                                        : <>
                                            <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => copyToClipboard(comment)}>Copy comment</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Report</li>
                                        </>
                                }
                            </ul>
                        </div>}
                    </>
                )}</DropdownMenu>
                <div className='flex flex-col justify-center items-center shrink-0'>
                    <button className='text-sm'>
                        {liked ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
                    </button>
                    <span className='text-xs'>{likes.length}</span>
                </div>
            </div>
        </div>
    )
}

const ReplyToComment = ({ profileImage, username, date, comment, likes }) => {

    const [liked, setLiked] = useState(false)

    const { SERVER_URL, user, copyToClipboard } = useContext(AppContext)


    return (
        <div className='flex w-full justify-center items-start gap-2 py-4 border-t'>
            <Link to={`/${username}`} className='shrink-0'>
                <img className='w-6 h-6 rounded-full object-cover' src={`${SERVER_URL}/uploads/profile-images/${profileImage}`} alt='profile image' />
            </Link>
            <div className='flex-1 flex justify-start items-start gap-2 flex-col'>
                <div className='flex justify-center items-center gap-1 text-xs text-slate-600'>
                    <Link to={`/${username}`} className='hover:underline'>@{username}</Link>
                    <span>&#8226;</span>
                    <Time timestamp={date} />
                </div>
                <div className='text-slate-800 text-xs break-all'>
                    {comment}
                </div>
            </div>


            <div className='flex gap-2 justify-center items-start'>
                <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef, top, setTop) => (
                    <>
                        <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu && 'bg-gray-200'} w-5 h-5 text-xs active:bg-gray-300 flex justify-center items-center rounded-full hover:bg-gray-200`}><BsThreeDots /></button>

                        {menu && <div ref={MenuRef} className={`${top ? "bottom-[130%]" : "top-[130%]"} z-40 shadow-lg w-max absolute right-0 bg-white border [&>ul>li]:p-2 text-xs [&>ul>li]:cursor-pointer`}>
                            <ul>
                                <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => copyToClipboard(comment)}>Copy comment</li>
                                <li className='hover:bg-gray-200 active:bg-gray-300'>Report</li>
                            </ul>
                        </div>}
                    </>
                )}</DropdownMenu>
                <div className='flex flex-col justify-center items-center shrink-0'>
                    <button className='text-sm'>
                        {liked ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
                    </button>
                    <span className='text-xs'>{likes.length}</span>
                </div>
            </div>
        </div>
    )
}

const CommentsLoader = () => {
    return (
        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
}