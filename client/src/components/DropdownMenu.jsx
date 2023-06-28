import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'

const DropdownMenu = ({ children }) => {

    const [menu, setMenu] = useState(false)

    const MenuButtonRef = useRef()
    const MenuRef = useRef()

    const [top, setTop] = useState(null)

    useEffect(() => {
        setTop(false)

        if (menu) {
            let MenuRectBottom = MenuRef.current.getBoundingClientRect().bottom
            let BodyRectBottom = document.body.getBoundingClientRect().bottom

            if (MenuRectBottom > BodyRectBottom) {
                setTop(true)
            } else {
                setTop(false)
            }
        }
    }, [menu])

    useEffect(() => {
        let handler = e => {
            if (e.target === MenuButtonRef.current) return;
            if (menu) {
                if (!MenuRef.current.contains(e.target)) {
                    setMenu(false)
                }
            }
        }

        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    })

    return (
        <div className='relative'>
            {children(menu, setMenu, MenuButtonRef, MenuRef, top, setTop)}
        </div>
    )
}

export default DropdownMenu