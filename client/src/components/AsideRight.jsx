import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import DropdownMenu from './DropdownMenu'
import { BsThreeDots } from 'react-icons/bs'

const AsideRight = () => {

    const { getUsers, users, loader, copyToClipboard, SERVER_URL } = useContext(AppContext)

    useEffect(() => {
        getUsers()
    }, [])


    return (
        <aside style={{ height: `calc(100vh - 56px)`, top: `56px` }} className='hidden lg:block sticky w-[300px] p-2 overlow-x-hidden overflow-y-auto'>
            {
                users.length > 0
                    ? <>
                        <p className="p-2 text-slate-700 text-sm font-medium">Suggested users:</p>

                        {(users.map((el, i) => (
                            <Link key={i} className="flex justify-start items-center p-2 gap-2 hover:bg-gray-200 active:bg-gray-300" to={`/${el.username}`}>
                                <img className='w-10 h-10 object-cover rounded-full' src={`${SERVER_URL}/uploads/profile-images/${el.profileImage}`} alt={el.username} />
                                <div className='flex flex-col justify-start'>
                                    <span className='text-slate-700 text-sm font-medium'>{el.fullname}</span>
                                    <span className='text-slate-600 text-sm'>@{el.username}</span>
                                </div>
                            </Link>
                        )))}
                    </>
                    : null
            }
            <p className="p-2 text-slate-400 text-sm font-medium">&copy; App 2023</p>
        </aside>
    )
}

export default AsideRight