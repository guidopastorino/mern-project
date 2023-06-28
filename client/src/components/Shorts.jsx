import React from 'react'
import { FaHeart, FaRegEye } from 'react-icons/fa'
import { MdBookmark, MdOutlineChatBubble } from 'react-icons/md'

const Shorts = () => {
  return (
    <div style={{height: 'calc(100vh - 56px)'}} className='w-full h-full flex-col flex justify-start items-start gap-10 overflow-y-auto overflow-x-hidden bg-white relative snap-y snap-mandatory border-3 border border-black'>
        <Short />
        <Short />
        <Short />
        <Short />
        <Short />
    </div>
  )
}

export default Shorts

const Short = () => {
    return(
        <div className='shrink-0 w-full h-full p-2 snap-center snap-always flex justify-center items-end gap-2'>

            <div className='rounded-lg bg-black overflow-hidden w-full h-full'></div>

            <div className='px-2 py-3 flex-col flex justify-around items-center gap-2'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <button type='button' className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><FaHeart /></button>
                    <span className='text-sm font-medium text-slate-700'>100</span>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <button type='button' className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><MdOutlineChatBubble /></button>
                    <span className='text-sm font-medium text-slate-700'>100</span>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <button type='button' className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><MdBookmark /></button>
                    <span className='text-sm font-medium text-slate-700'>100</span>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <button type='button' className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400'><FaRegEye /></button>
                    <span className='text-sm font-medium text-slate-700'>0</span>
                </div>
            </div>
        </div>
    )
}