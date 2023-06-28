import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsList, BsFillPersonFill } from 'react-icons/bs'
import { HiMoon } from 'react-icons/hi'
import { IoOptions } from 'react-icons/io5'
import { GoSearch } from 'react-icons/go'
import DropdownMenu from './DropdownMenu'
import { AppContext } from '../context/AppContext'
import Loader from './Loader'
import axios from 'axios'
import { Link } from 'react-router-dom'
import HamburgerMenu from './HamburgerMenu'

const NavbarTop = () => {

    const navbarRef = useRef()

    return (
        <header className='backdrop-blur-lg w-full h-[56px] sticky top-0 bg-white/[.8] z-50'>

            <div className='max-w-screen-xl w-full flex justify-between items-center gap-10 p-2 mx-auto'>
                <div className='flex justify-start items-center flex-grow basis-0 font-medium'>
                    <Link to={'/'}>AppLogo</Link>
                </div>

                <SearchBar />

                <div className='hidden md:flex gap-2 justify-end items-center flex-grow basis-0'>
                    <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef) => (
                        <>
                            <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu ? 'bg-gray-200' : "tooltip"} w-10 h-10 flex justify-center items-center rounded-full text-lg hover:bg-gray-200 active:bg-gray-300`} data-tooltip="Feed preferences"><IoOptions /></button>

                            {menu && <div ref={MenuRef} className='z-40 shadow-lg w-max absolute top-[120%] right-0 bg-white border [&>ul>li]:p-2 [&>ul>li]:cursor-pointer'>
                                <ul>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>Normal feed</li>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>Following</li>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>Starred people</li>
                                </ul>
                            </div>}
                        </>
                    )}</DropdownMenu>

                    <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef) => (
                        <>
                            <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu ? 'bg-gray-200' : "tooltip"} w-10 h-10 flex justify-center items-center rounded-full text-lg hover:bg-gray-200 active:bg-gray-300`} data-tooltip="Theme"><HiMoon /></button>

                            {menu && <div ref={MenuRef} className='z-40 shadow-lg w-max absolute top-[120%] right-0 bg-white border [&>ul>li]:p-2 [&>ul>li]:cursor-pointer'>
                                <ul>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>Change to black</li>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>Change to white</li>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>System default</li>
                                </ul>
                            </div>}
                        </>
                    )}</DropdownMenu>

                    <DropdownMenu>{(menu, setMenu, MenuButtonRef, MenuRef) => (
                        <>
                            <button ref={MenuButtonRef} onClick={() => setMenu(!menu)} type='button' className={`${menu ? 'bg-gray-200' : "tooltip"} w-10 h-10 flex justify-center items-center rounded-full text-lg hover:bg-gray-200 active:bg-gray-300`} data-tooltip="Profile"><BsFillPersonFill /></button>

                            {menu && <div ref={MenuRef} className='z-40 shadow-lg w-max absolute top-[120%] right-0 bg-white border [&>ul>li]:p-2 [&>ul>li]:cursor-pointer'>
                                <ul>
                                    <li className='hover:bg-gray-200 active:bg-gray-300'>My profile</li>
                                    <li onClick={() => {
                                        localStorage.removeItem("logged")
                                        localStorage.removeItem("userData")
                                        window.location.reload()
                                    }} className='hover:bg-gray-200 active:bg-gray-300'>Log out</li>
                                </ul>
                            </div>}
                        </>
                    )}</DropdownMenu>
                </div>

                <div className='flex md:hidden justify-end flex-grow basis-0'>
                    <HamburgerMenu />
                </div>
            </div>
        </header>
    )
}

export default NavbarTop


const SearchBar = () => {

    const { searchBar, setSearchBar } = useContext(AppContext)

    const searchInputRef = useRef()
    const searchResultsRef = useRef()

    const [searchValue, setSearchValue] = useState("")
    const [menu, setMenu] = useState(false)

    useEffect(() => {
        let handler = e => {
            if (menu) {
                if (e.target == searchInputRef.current) return;
                if (!searchResultsRef.current.contains(e.target)) {
                    setMenu(false)
                    setSearchBar(false)
                }
            }
        }

        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    })

    const [users, setUsers] = useState([])
    const [loaderMsg, setLoaderMsg] = useState("")

    useEffect(() => {
        if (searchValue.length > 0) {
            setLoaderMsg("Finding results...")

            axios.get(`http://localhost:5000/api/search/${searchValue}`)
                .then(res => {
                    setUsers(res.data)
                    setLoaderMsg("")
                })
                .catch(err => console.log(err))
        }
    }, [searchValue])


    const handleInputChange = e => {
        setSearchValue(e.target.value)
    }

    return (
        <div className='relative'>
            <div className='w-full h-10 max-w-[300px] rounded-full overflow-hidden flex justify-center items-center border'>
                <input ref={searchInputRef} onFocus={() => {
                    setMenu(true)
                    setSearchBar(true)
                }} value={searchValue} onChange={e => handleInputChange(e)} placeholder='Search' type="search" className='text-sm text-slate-700 w-full p-3 h-full outline-none' />
                <button className='flex justify-center items-center h-10 w-16 rounded-tr-full rounded-br-full hover:bg-gray-200 border-l'><GoSearch /></button>
            </div>

            {/* search results */}
            {menu && <div ref={searchResultsRef} className='overflow-hidden w-[400px] shadow-lg border rounded-lg bg-white absolute top-[130%] left-1/2 translate-x-[-50%]'>
                {searchValue.length > 0 && <p className='p-2 text-slate-700 text-sm font-medium'>Searching for: <span className='italic'>"{searchValue}"</span></p>}
                {searchValue.length < 1 && <>
                    <p className='p-2 text-slate-700 text-sm font-medium'>Search recommendations:</p>
                    <ul>
                        <li className='p-2 cursor-pointer hover:bg-gray-200 active:bg-gray-300' onClick={(e) => setSearchValue(e.target.textContent)}>Peoples</li>
                        <li className='p-2 cursor-pointer hover:bg-gray-200 active:bg-gray-300' onClick={(e) => setSearchValue(e.target.textContent)}>Trends</li>
                        <li className='p-2 cursor-pointer hover:bg-gray-200 active:bg-gray-300' onClick={(e) => setSearchValue(e.target.textContent)}>Topics</li>
                        <li className='p-2 cursor-pointer hover:bg-gray-200 active:bg-gray-300' onClick={(e) => setSearchValue(e.target.textContent)}>Places</li>
                    </ul>
                </>}
                {loaderMsg.length > 0 && <p className='p-2 text-slate-700 text-sm font-medium'>{loaderMsg}</p>}
                {
                    (users.length < 1)
                        ? <p className='p-2 text-slate-700 text-sm font-medium'>No users found</p>
                        : (users.map((el, i) => (
                            <Link className='flex justify-start items-center gap-2 p-2 hover:bg-gray-200 active:bg-gray-300' to={`/${el.username}`} key={i}>
                                <img className='w-10 h-10 object-cover rounded-full' src={`http://localhost:5000/uploads/profile-images/${el.profileImage}`} alt={el.username} />
                                <div className='flex flex-col justify-start'>
                                    <span className='text-slate-700 text-sm font-medium'>{el.fullname}</span>
                                    <span className='text-slate-600 text-sm'>@{el.username}</span>
                                </div>
                            </Link>
                        )))
                }
                <p className='p-2 text-slate-700 text-sm font-medium'>Search history:</p>
            </div>}
        </div>
    )
}

