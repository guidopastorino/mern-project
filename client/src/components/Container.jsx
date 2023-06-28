import React, { useContext } from 'react'
import AsideLeft from './AsideLeft'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import AsideRight from './AsideRight'

const Container = () => {

    const { searchBar, setSearchBar } = useContext(AppContext)

    return (
        <div className={`w-full bg-white duration-300 ${searchBar ? "brightness-75 pointer-events-none" : ''}`}>
            <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 md:grid-cols-[_300px_1fr_] lg:grid-cols-[_300px_1fr_300px_] gap--x-10 bg-white">
                <AsideLeft />
                <main className='pb-[20vh] w-full max-w-[500px] mx-auto'>
                    <Outlet />
                </main>
                <AsideRight />
            </div>
        </div>
    )
}

export default Container