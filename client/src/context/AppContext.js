import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AppContext = createContext()

export default function AppContextProvider({ children }) {


    const [user, setUser] = useState(null)

    const [logged, setLogged] = useState(false)


    const [loader, setLoader] = useState(false)
    const [errMsg, setErrMsg] = useState(false)

    // searchbar active state
    const [searchBar, setSearchBar] = useState(false)

    // video files volume
    const [volume, setVolume] = useState(false)


    useEffect(() => {
        if (errMsg.length > 0) {
            setTimeout(() => {
                setErrMsg("")
            }, 4000);
        }
    }, [errMsg])

    // functions
    // get all posts
    const [posts, setPosts] = useState([])


    function getPosts() {
        setLoader(true)
        axios.get('https://mern-project-tj8o.onrender.com/api/get-posts')
            .then(res => {
                setPosts(res.data.reverse())
                setLoader(false)
            })
            .catch(err => console.log(err))
    }


    // delete post (id)
    function deletePost(postID) {
        axios.delete(`https://mern-project-tj8o.onrender.com/api/delete-post/${postID}`)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }


    // edit post
    const [editPostModal, setEditPostModal] = useState(false)
    const [newPostOptions, setNewPostOptions] = useState({
        postID: "",
        newContent: ""
    })

    function editPost(postID, newContent) {
        axios.patch(`https://mern-project-tj8o.onrender.com/api/edit-post/${postID}`, { newContent })
            .then(res => {
                console.log(res)
                setEditPostModal(false)
                setErrMsg(res.data.message)
                getPosts()
            })
            .catch(err => console.log(err))
    }


    // get all users
    const [users, setusers] = useState([])

    function getUsers() {
        axios.get('https://mern-project-tj8o.onrender.com/api/get-users')
            .then(res => {
                setusers(res.data.filter(el => el.username !== user.username))
            })
            .catch(err => console.log(err))
    }

    // delete user
    function deleteUser(username) {
        axios.delete(`https://mern-project-tj8o.onrender.com/api/delete-user/${username}`)
            .then(res => {
                setErrMsg(res.data.message)
                setTimeout(() => {
                    localStorage.removeItem("logged")
                    localStorage.removeItem("userData")
                    window.location.reload()
                }, 1000);
            })
            .catch(err => {
                setErrMsg(err.message)
            })
    }

    // COMMENTS
    // boolean to decide if show modal or not
    const [commentsModal, setCommentsModal] = useState(false)
    // post comments (stored by post id)
    const [postComments, setPostComments] = useState([])

    const [postCommentsID, setPostCommentsID] = useState(null)

    // llamar a la funcion cada vez que se renderiza el modal
    useEffect(() => {
        getPostComments(postCommentsID)
    }, [postCommentsID])

    function getPostComments(postID) {
        setPostComments([])
        setLoader(true)
        axios.get(`https://mern-project-tj8o.onrender.com/api/get-comments/${postID}`)
            .then(res => {
                setPostComments(res.data)
                console.log("postCommentsID", res)
                setLoader(false)
            })
            .catch(err => console.log(err))
    }


    // Copy to clipboard function
    // @params: text to copy
    function copyToClipboard(textToCopy) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('Texto copiado al portapapeles:', textToCopy);
            })
            .catch((error) => {
                console.error('Error al copiar al portapapeles:', error);
            });
    };




    return (
        <AppContext.Provider value={{ user, setUser, logged, setLogged, posts, setPosts, loader, setLoader, getPosts, deletePost, errMsg, setErrMsg, searchBar, setSearchBar, copyToClipboard, editPostModal, setEditPostModal, editPost, newPostOptions, setNewPostOptions, volume, setVolume, getUsers, users, setusers, deleteUser, commentsModal, setCommentsModal, postComments, setPostComments, getPostComments, postCommentsID, setPostCommentsID }}>
            {children}
        </AppContext.Provider>
    )
}