import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdOutlineImage, MdLocationPin, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineChatBubble, MdBookmark } from 'react-icons/md'
import { BsEmojiSmile, BsThreeDots, BsFillPencilFill, BsArrowsFullscreen, BsFullscreenExit, BsFillVolumeMuteFill, BsFillVolumeDownFill } from 'react-icons/bs'
import { FaHeart, FaPlay, FaRegEye } from 'react-icons/fa'
import Time from './Time'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import Loader from './Loader'
import DropdownMenu from './DropdownMenu'
import HashWords from './HashWords'

const Feed = () => {

    const { posts, setPosts, loader, setLoader, getPosts } = useContext(AppContext)

    // get posts
    useEffect(() => {
        getPosts()
    }, [])

    return (
        <>
            <CreatePost />
            {loader && <div className='flex justify-center items-center py-24'>
                <Loader />
            </div>}
            {!loader
                ? (posts.length > 0)
                    ? posts.map((el, i) => {
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
                    : <span className="block text-center text-slate-500 my-5 text-sm">No posts to show right now. Start posting to see content here.</span>
                : null
            }
        </>
    )
}

export default Feed

const CreatePost = () => {
    const { user, posts, setPosts, loader, setLoader, getPosts } = useContext(AppContext)


    const SliderRef = useRef()
    const iptFilesRef = useRef()
    const formRef = useRef()

    const [files, setFiles] = useState([])

    const handleFiles = e => {
        let filesArr = Array.from(e.target.files)
        setFiles(filesArr)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("profileImage", user.profileImage)
        formData.append("fullname", user.fullname)
        formData.append("username", user.username)
        formData.append("description", formRef.current.description.value)

        files.forEach(el => {
            formData.append("files", el)
        })

        axios.post('https://mern-project-tj8o.onrender.com/api/make-post', formData, { headers: { "Content-Type": "multipart/formdata" } })
            .then(() => {
                e.target.reset()
                setFiles([])
                getPosts()
            })
            .catch(err => console.log(err))
    }

    return (
        <section className='flex justify-center items-start p-2 gap-2 border'>
            <div className='shrink-0'>
                <Link to={'/profile'}>
                    <img className='hover:brightness-95 active:brightness-90 duration-100 w-10 h-10 object-cover rounded-full' src={`https://mern-project-tj8o.onrender.com/uploads/profile-images/${user.profileImage}`} alt="image" />
                </Link>
            </div>
            <form ref={formRef} className='block flex-1 overflow-hidden' onSubmit={e => handleSubmit(e)}>
                <div className='flex flex-col justify-center items-start gap-2'>
                    <textarea name='description' placeholder={`What's on your mind, ${user.fullname}?`} className='w-full h-[100px] border bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 p-2 rounded-lg outline-none border hover:border-black focus:border-black'></textarea>
                    {/* files preview */}
                    {(files.length > 0) && <div className='relative w-full'>

                        <div ref={SliderRef} className='w-full overflow-x-auto flex flex-start items-center gap-2'>

                            {files.map((el, i) => (
                                el.type.startsWith("image")
                                    ? <div key={i} className='border shrink-0 w-24 h-24 hover:brightness-75 [&>*]:w-full [&>*]:h-full [&>*]:object-cover'>
                                        <img src={URL.createObjectURL(el)} alt={el.name} />
                                    </div>
                                    : <div key={i} className='border shrink-0 w-24 h-24 hover:brightness-75 [&>*]:w-full [&>*]:h-full [&>*]:object-cover'>
                                        <video src={URL.createObjectURL(el)} alt={el.name} autoPlay muted></video>
                                    </div>
                            ))}
                        </div>

                        <button onClick={e => SliderRef.current.scrollLeft -= SliderRef.current.clientWidth} type='button' className='w-5 h-5 bg-white flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300 absolute top-1/2 translate-y-[-50%] left-2'><MdKeyboardArrowLeft /></button>
                        <button onClick={e => SliderRef.current.scrollLeft += SliderRef.current.clientWidth} type='button' className='w-5 h-5 bg-white flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300 absolute top-1/2 translate-y-[-50%] right-2'><MdKeyboardArrowRight /></button>
                    </div>}


                    <div className='flex justify-center items-center gap-1'>
                        <input ref={iptFilesRef} accept='image/*, video/*' hidden type="file" multiple onChange={e => handleFiles(e)} />
                        <button data-tooltip="Files" onClick={() => iptFilesRef.current.click()} type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300'><MdOutlineImage /></button>
                        <button data-tooltip="Location" type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300'><MdLocationPin /></button>
                        <button data-tooltip="Feelings" type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300'><BsEmojiSmile /></button>
                    </div>
                    <button className='self-end py-2 px-4 text-white bg-slate-600 hover:bg-slate-700 active:brightness-75 rounded-md text-sm' type='submit'>
                        POST
                    </button>
                </div>
            </form>
        </section>
    )
}

export function Post({ version, postID, profileImage, fullname, username, date, description, filesContent, likes, comments, views, saved }) {

    const { user, deletePost, getPosts, copyToClipboard, editPostModal, setEditPostModal, newPostOptions, setNewPostOptions, commentsModal, setCommentsModal, postCommentsID, setPostCommentsID } = useContext(AppContext)


    return (
        <section className='border my-4'>
            <div className='p-2 flex justify-between gap-2 items-center'>
                <div className='flex gap-2 justify-start items-center'>
                    <Link to={`/${username}`} className='shrink-0'>
                        <img className='w-10 duration-100 hover:brightness-95 active:brightness-90 h-10 object-cover rounded-full' src={`https://mern-project-tj8o.onrender.com/uploads/profile-images/${profileImage}`} alt="image" />
                    </Link>
                    <div className='flex justify-start items-start flex-col'>
                        <Link to={`/${username}`} className='font-medium hover:underline flex flex-start items-baseline gap-1 truncate'>
                            <span className='text-slate-700'>{fullname}</span>
                            <span className='text-slate-700'>&#8226;</span>
                            <span className='text-slate-600 text-sm'>@{username}</span>
                        </Link>
                        <div className='text-xs flex justify-center items-center gap-2'>
                            <Time timestamp={date} />
                            {version > 0 && <div className="flex justify-center items-center gap-1 p-0.5 px-1 rounded-sm bg-gray-200"><BsFillPencilFill /> Edited</div>}
                        </div>
                    </div>
                </div>
                <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef, top, setTop) => (
                    <>
                        <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu && 'bg-gray-200'} w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300`}><BsThreeDots /></button>

                        {menu && <div ref={MenuRef} className={`${top ? "bottom-[130%]" : "top-[130%]"} z-40 shadow-lg w-max absolute right-0 bg-white border [&>ul>li]:p-2 [&>ul>li]:cursor-pointer`}>
                            <ul>
                                {
                                    (user.username == username)
                                        ? <>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>
                                                <Link to={`/${username}`} className='block h-full'>My profile</Link>
                                            </li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => {
                                                setEditPostModal(true)
                                                setMenu(false)
                                                setNewPostOptions({
                                                    postID,
                                                    newContent: description
                                                })
                                            }}>Edit post content</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => {
                                                deletePost(postID)
                                                setTimeout(() => {
                                                    getPosts()
                                                }, 50);
                                            }}>Delete</li>
                                        </>
                                        : <>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>View @{username}'s profile</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Follow @{username}</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Block @{username}</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300'>Report @{username}'s post</li>
                                            <li className='hover:bg-gray-200 active:bg-gray-300' onClick={() => copyToClipboard(`http://localhost:3000/${username}`)}>Copy user link</li>
                                        </>
                                }
                            </ul>
                        </div>}
                    </>
                )}</DropdownMenu>
            </div>
            <div>
                {description.length > 0 && <span className='text-sm p-2 leading-[20px] block text-slate-800'> <HashWords text={description} /> </span>}
                {filesContent.length > 0 && <FilesContentContainer files={filesContent} />}
            </div>
            <div className='px-2 py-3 flex justify-around items-center gap-2'>
                {/* like button */}
                <PostLikeButton likes={likes} postID={postID} />

                <div className='flex justify-center items-center gap-2'>
                    <button onClick={() => {
                        setCommentsModal(true)
                        setPostCommentsID(postID)
                    }} data-tooltip="Comment" type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><MdOutlineChatBubble /></button>
                    {comments.length > 0 && <span className='text-sm font-medium text-slate-700'>{comments.length}</span>}
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <button data-tooltip="Save" type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><MdBookmark /></button>
                    {saved.length > 0 && <span className='text-sm font-medium text-slate-700'>{saved.length}</span>}
                </div>
                <div className='flex justify-center items-center gap-2'>
                    <button data-tooltip="Views" type='button' className='tooltip w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><FaRegEye /></button>
                    <span className='text-sm font-medium text-slate-700'>0</span>
                </div>
            </div>
        </section>
    )
}

const FilesContentContainer = ({ files }) => {

    const SliderRef = useRef()

    const [btnLeft, setBtnLeft] = useState(false)
    const [btnRight, setBtnRight] = useState(true)

    const handleSliderScroll = e => {
        // btn left
        if (SliderRef.current.scrollLeft <= 0) {
            setBtnLeft(false)
        } else {
            setBtnLeft(true)
        }

        // btn right
        if (Math.ceil(SliderRef.current.scrollLeft) === (SliderRef.current.scrollWidth - SliderRef.current.clientWidth)) {
            setBtnRight(false)
        } else {
            setBtnRight(true)
        }
    }

    return (
        <div className='relative bg-black'>
            {/* slider */}
            <div ref={SliderRef} className='w-full max-h-[450px] h-[60vh] flex justify-start items-center overflow-y-hidden overflow-x-auto snap-x snap-mandatory' onScroll={e => handleSliderScroll(e)}>
                {
                    files.map((el, i) => (
                        el.mimetype.startsWith("image")
                            ? <img key={i} className='snap-always snap-center w-full object-contain shrink-0' src={`https://mern-project-tj8o.onrender.com/uploads/post-files/${el.filename}`} alt={el.originalname} />
                            : <VideoPostContainer video={`https://mern-project-tj8o.onrender.com/uploads/post-files/${el.filename}`} /> // alt={el.originalname}
                    ))

                }
            </div>
            {/* slider buttons */}
            {files.length > 1 && <>
                {btnLeft && <button onClick={e => SliderRef.current.scrollLeft -= SliderRef.current.clientWidth} type='button' className='w-8 h-8 bg-white flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300 absolute top-1/2 translate-y-[-50%] left-2'><MdKeyboardArrowLeft /></button>}
                {btnRight && <button onClick={e => SliderRef.current.scrollLeft += SliderRef.current.clientWidth} type='button' className='w-8 h-8 bg-white flex justify-center items-center rounded-full hover:bg-gray-200 active:bg-gray-300 absolute top-1/2 translate-y-[-50%] right-2'><MdKeyboardArrowRight /></button>}
            </>}
        </div>
    )
}

const VideoPostContainer = ({ video }) => {

    const { volume, setVolume } = useContext(AppContext)

    const videoContainerRef = useRef()

    const videoRef = useRef()

    const [videoPointerEvents, setVideoPointerEvents] = useState(false)

    const [videoPaused, setVideoPaused] = useState(false)

    const [videoFullscreen, setVideoFullscreen] = useState(false)


    useEffect(() => {
        const io = new IntersectionObserver(callback, { threshold: .9 })

        function callback(entries) {
            const entry = entries[0]

            if (entry.isIntersecting) {
                if (entry.isIntersecting && !videoPaused && videoRef?.current?.paused) {
                    videoRef.current.play()
                    setVideoPaused(false)
                }
                setVideoPointerEvents(true)
            } else {
                if (videoRef.current !== null) {
                    videoRef.current.pause()
                    setVideoPointerEvents(false)
                }
            }

        }

        io.observe(videoContainerRef.current)
    })


    const handleVideoPause = (e) => {
        let video = e.target.children[0]


        if (e.target.tagName !== 'BUTTON') {
            if (video.paused) {
                video.play()
                setVideoPaused(false)
            } else {
                video.pause()
                setVideoPaused(true)
            }
        }
    }


    const handleVideoFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
            setVideoFullscreen(false)
        } else {
            videoContainerRef.current.requestFullscreen()
            setVideoFullscreen(true)
        }
    }


    // handle video volume
    useEffect(() => {
        volume
            ? videoRef.current.volume = 1
            : videoRef.current.volume = 0
    }, [volume])



    return (
        <div className='w-full h-full shrink-0 snap-always snap-center'>
            <div ref={videoContainerRef} className={`${videoPointerEvents ? 'pointer-events-all' : 'pointer-events-none'} w-full h-full relative`} onClick={(e) => handleVideoPause(e)}>

                <video ref={videoRef} className='w-full h-full object-contain pointer-events-none' src={video} loop></video>

                {videoPaused && <FaPlay className='pointer-events-none absolute opacity-75 text-5xl top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50 text-white' />}


                {/* request fullscreen */}
                {!videoFullscreen && <button onClick={() => {
                    handleVideoFullscreen()
                }} className='w-7 h-7 text-xs rounded-full opacity-75 bg-black text-white absolute top-2 right-2 flex justify-center items-center'><BsArrowsFullscreen /></button>}


                {/* exit fullscreen */}
                {videoFullscreen && <button onClick={() => {
                    handleVideoFullscreen()
                }} className='w-7 h-7 text-md rounded-full opacity-75 bg-black text-white absolute top-2 right-2 flex justify-center items-center'><BsFullscreenExit /></button>}

                {/* handle volume */}
                <button onClick={() => setVolume(!volume)} className='w-7 h-7 text-md rounded-full opacity-75 bg-black text-white absolute bottom-2 right-2 flex justify-center items-center'>
                    {volume ? <BsFillVolumeDownFill /> : <BsFillVolumeMuteFill />}
                </button>
            </div>
        </div>
    )
}

// like button
const PostLikeButton = ({ likes, postID }) => {

    const { user, getPosts } = useContext(AppContext)

    const [liked, setLiked] = useState(false)

    useEffect(() => {
        getLike()
    }, [])

    const makeLike = () => {
        axios.get(`https://mern-project-tj8o.onrender.com/api/make-like/${user.username}/${postID}`)
            .then(res => {
                setLiked(res.data.liked)
                // get all posts
                getPosts()
            })
            .catch(err => console.log(err))
    }


    const getLike = () => {
        axios.get(`https://mern-project-tj8o.onrender.com/api/get-like/${user.username}/${postID}`)
            .then(res => setLiked(res.data.liked))
            .catch(err => console.log(err))
    }


    return (
        <div className='flex justify-center items-center gap-2'>
            <button onClick={makeLike} data-tooltip="Like" type='button' className={`${liked ? 'bg-red-200 hover:bg-red-300 text-red-700 active:bg-red-400' : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-black'} tooltip w-8 h-8 flex justify-center items-center rounded-full active:scale-95 duration-100`}><FaHeart /></button>
            {likes.length > 0 && <span className='text-sm font-medium text-slate-700'>{likes.length}</span>}
        </div>
    )
}