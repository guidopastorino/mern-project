import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import ReactDOM from 'react-dom'
import { IoMdClose } from 'react-icons/io'

const EditPostModal = () => {

    const { editPostModal, setEditPostModal, editPost, newPostOptions } = useContext(AppContext)
    const [newContent, setNewContent] = useState("")


    useEffect(() => {
        if (editPostModal) {
            document.querySelector("#root").classList.add("brightness-75", "pointer-events-none")
            document.querySelector("body").classList.add("overflow-hidden")
        } else {
            document.querySelector("#root").classList.remove("brightness-75", "pointer-events-none")
            document.querySelector("body").classList.remove("overflow-hidden")
        }
    }, [editPostModal])

    const btnModalRef = useRef()
    const ModalRef = useRef()
    const newTextContentRef = useRef()

    useEffect(() => {
        let handler = e => {
            if (e.target === btnModalRef.current) return;
            if (editPostModal) {
                if (!ModalRef.current.contains(e.target)) {
                    setEditPostModal(false)
                }
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    })

    return (
        <>
            {editPostModal && <>
                {
                    ReactDOM.createPortal(
                        <div ref={ModalRef} className='w-full max-w-[500px] bg-white rounded-md shadow-lg fixed top-24 left-1/2 translate-x-[-50%] z-50 overflow-y-auto max-h-[70vh]'>
                            <div className='sticky top-0 bg-white p-4 border-b flex justify-between items-center gap-2'>
                                <span className='font-medium text-lg'>Edit post content</span>
                                <button ref={btnModalRef} onClick={() => setEditPostModal(!editPostModal)} className='p-1 rounded-sm hover:bg-gray-200 active:bg-gray-300 text-xl'><IoMdClose /></button>
                            </div>
                            <div className='p-4 flex flex-col flex-start gap-2'>
                                <span className='font-medium text-md'>Current content:</span>

                                <p className="mb-2 text-slate-600 text-sm font-medium">{newPostOptions.newContent}</p>

                                <span className='font-medium text-md'>New content:</span>

                                <textarea onChange={(e) => setNewContent(e.target.value)} ref={newTextContentRef} className='w-full border focus:border-black rounded-md p-2 block h-24 text-md outline-none' placeholder='Type your new post content here'></textarea>
                            </div>
                            <div className='w-full flex justify-end items-center p-2'>
                                <button disabled={newContent.length < 1} className={`${newContent.length < 1 ? "opacity-50 cursor-not-allowed" : "opacity-1 hover:bg-slate-700 active:brightness-75 cursor-pointer"} py-2 px-4 text-white bg-slate-600 rounded-md text-sm`} type='submit' onClick={() => editPost(newPostOptions.postID, newContent)}>
                                    EDIT POST
                                </button>
                            </div>
                        </div>,
                        document.body
                    )
                }
            </>}
        </>
    )
}

export default EditPostModal