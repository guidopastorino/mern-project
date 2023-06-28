import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import NavbarTop from './NavbarTop'
import Container from './Container'
import EditPostModal from './EditPostModal'
import Comments from './Comments'

const Home = () => {

    const { logged, setLogged, user } = useContext(AppContext)

    return (
        <>
            {
                logged && user
                    ? <>
                        <NavbarTop />
                        <Container />
                    </>
                    : "Loading..."
            }

            {/* edit post modal */}
            <EditPostModal />
            {/* comments */}
            <Comments />
        </>
    )
}

export default Home