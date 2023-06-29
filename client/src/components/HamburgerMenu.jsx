import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsList } from 'react-icons/bs'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const HamburgerMenu = () => {

  const { user } = useContext(AppContext)

  const [menu, setMenu] = useState(false)

  const menuRef = useRef()
  const menuButtonRef = useRef()

  useEffect(() => {
    let handler = e => {
      if (e.target === menuButtonRef.current) return;
      if (menu) {
        if (!menuRef.current.contains(e.target)) {
          setMenu(false)
        }
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  })

  useEffect(() => {
    if (menu) {
      document.querySelector("#root").classList.add("brightness-75", "pointer-events-none")
      document.querySelector("body").classList.add("overflow-hidden")
    } else {
      document.querySelector("#root").classList.remove("brightness-75", "pointer-events-none")
      document.querySelector("body").classList.remove("overflow-hidden")
    }
  }, [menu])

  return (
    <>
      <button onClick={() => setMenu(!menu)} ref={menuButtonRef} className="w-10 h-10 flex justify-center items-center rounded-full text-xl hover:bg-gray-200 active:bg-gray-300">
        <BsList />
      </button>

      {
        ReactDOM.createPortal(
          <div ref={menuRef} className={`${menu ? "right-0" : "right-[-100%]"} duration-300 fixed top-0 bg-white shadow-lg w-[70%] z-50 h-full`}>
            <ul>
              <li className='hover:bg-gray-200 active:bg-gray-300 p-2'><Link to={`/${user.username}`}>My profile</Link></li>
              <li className='hover:bg-gray-200 active:bg-gray-300 p-2'><Link to={'/'}>Feed</Link></li>
              <li className='hover:bg-gray-200 active:bg-gray-300 p-2'><Link to={'/shorts'}>Shorts</Link></li>
              <li className='hover:bg-gray-200 active:bg-gray-300 p-2'><Link to={'/hashtags/all'}>Hashtags</Link></li>
              <li className='hover:bg-gray-200 active:bg-gray-300 p-2'><Link to={'/friends'}>Friends</Link></li>
              <hr className='my-3' />
              <li onClick={() => {
                localStorage.removeItem("logged")
                localStorage.removeItem("userData")
                window.location.reload()
              }} className='hover:bg-gray-200 active:bg-gray-300 p-2'>Log out</li>
            </ul>
          </div>,
          document.body
        )
      }
    </>
  )
}

export default HamburgerMenu