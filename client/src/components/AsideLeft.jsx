import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { MdPlayCircleOutline, MdPlayCircle, MdOutlineHome, MdHome } from 'react-icons/md'
import { AppContext } from '../context/AppContext'
import { HiHashtag, HiOutlineHashtag } from 'react-icons/hi'
import { IoPeopleOutline, IoPeopleSharp } from 'react-icons/io5'

const AsideLeft = () => {

    const { user, SERVER_URL } = useContext(AppContext)

    return (
        <aside style={{ height: `calc(100vh - 56px)`, top: "56px" }} className='hidden md:block sticky w-[300px] p-2 overlow-x-hidden overflow-y-auto'>
            <ul>
                <li>
                    <NavLink to={`/${user.username}`} end className={({ isActive }) => (isActive ? 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 activeLink [&>span]:font-medium [&>div>img]:outline-2 [&>div>img]:outline-black [&>div>img]:outline' : 'unactiveLink') + " " + "flex justify-start items-center gap-2 p-2 hover:bg-gray-200 rounded-lg"}>
                        <div className='w-10 h-10 flex justify-center items-center'>
                            <img className='w-full h-full object-cover rounded-full' src={`${SERVER_URL}/uploads/profile-images/${user.profileImage}`} alt="image" />
                        </div>

                        <span className='truncate'>{user.fullname}</span>
                    </NavLink>
                </li>

                <AsideNavLink
                    key={1}
                    title={"Feed"}
                    path={'/'}
                    unactiveIcon={<MdOutlineHome className='w-full h-full object-cover p-2' />}
                    activeIcon={<MdHome className='w-full h-full object-cover p-2' />}
                />

                <AsideNavLink
                    key={2}
                    title={"Shorts"}
                    path={'/shorts'}
                    unactiveIcon={<MdPlayCircleOutline className='w-full h-full object-cover p-2' />}
                    activeIcon={<MdPlayCircle className='w-full h-full object-cover p-2' />}
                />

                <AsideNavLink
                    key={3}
                    title={"Hashtags"}
                    path={'/hashtags/all'}
                    unactiveIcon={<HiOutlineHashtag className='w-full h-full object-cover p-2' />}
                    activeIcon={<HiHashtag className='w-full h-full object-cover p-2' />}
                />

                <AsideNavLink
                    key={4}
                    title={"Friends"}
                    path={'/friends'}
                    unactiveIcon={<IoPeopleOutline className='w-full h-full object-cover p-2' />}
                    activeIcon={<IoPeopleSharp className='w-full h-full object-cover p-2' />}
                />

            </ul>
        </aside>
    )
}

export default AsideLeft

const AsideNavLink = ({ title, path, unactiveIcon, activeIcon }) => {
    return (
        <li>
            <NavLink to={path} end className={({ isActive }) => (isActive ? 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 activeLink [&>span]:font-medium' : 'unactiveLink') + " " + "flex justify-start items-center gap-2 p-2 hover:bg-gray-200 rounded-lg"}>
                <div className='w-10 h-10 flex justify-center items-center'>
                    {unactiveIcon}
                    {activeIcon}
                </div>

                <span className='truncate'>{title}</span>
            </NavLink>
        </li>
    )
} 