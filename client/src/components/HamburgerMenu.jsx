import React from 'react'
import { BsList } from 'react-icons/bs'

const HamburgerMenu = () => {
  return (
    <>
      <button className="w-10 h-10 flex justify-center items-center rounded-full text-xl hover:bg-gray-200 active:bg-gray-300">
        <BsList />
      </button>
    </>
  )
}

export default HamburgerMenu