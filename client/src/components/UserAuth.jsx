import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import Loader from './Loader'

const UserAuth = () => {

  const [logAuth, setLogAuth] = useState(true)

  return (
    <div className='h-[100dvh] flex justify-center items-center'>
      <div className='w-full max-w-[400px] shadow-lg border rounded-lg mx-auto p-2'>
        <div className='w-full grid grid-cols-2 w-full mb-5 relative'>
          <div onClick={() => setLogAuth(true)} className={`${logAuth && "bg-gray-300"} rounded-lg duration-100 cursor-pointer user-select-none hover:bg-gray-300 active:bg-gray-400 text-center p-3`}>Login</div>
          <div onClick={() => setLogAuth(false)} className={`${!logAuth && "bg-gray-300"} rounded-lg duration-100 cursor-pointer user-select-none hover:bg-gray-300 active:bg-gray-400 text-center p-3`}>Register</div>
        </div>
        {logAuth && <Login />}
        {!logAuth && <Register />}
      </div>
    </div>
  )
}

export default UserAuth

const Login = () => {

  
  const { logged, setLogged, errMsg, setErrMsg, loader, setLoader } = useContext(AppContext)
  
  const [password, setPassword] = useState(false)
  const formRef = useRef()


  const handleSubmit = e => {
    e.preventDefault()

    if ((formRef.current.emailOrUsername.value || formRef.current.password.value) === "") {
      setErrMsg("Completa los campos vacios")
    } else {
      setLoader(true)
      
      const formData = new FormData()

      formData.append("emailOrUsername", formRef.current.emailOrUsername.value)
      formData.append("password", formRef.current.password.value)

      axios.post('http://localhost:5000/api/login', formData, { headers: { "Content-Type": "multipart/formdata" } })
        .then(res => {
          setLoader(false)
          setErrMsg(res.data.message)
          setLogged(res.data.logged)
          localStorage.setItem("logged", JSON.stringify(res.data.logged))
          localStorage.setItem("userData", JSON.stringify(res.data.user))
          window.location.reload()
        })
        .catch(err => {
          setLoader(false)
          setErrMsg(err.response.data.message)
        })
    }
  }

  return (
    <form ref={formRef} className='flex flex-col justify-center items-center gap-3 w-full' onSubmit={e => handleSubmit(e)}>
      <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="text" name='emailOrUsername' placeholder='Email or username' autoComplete='off' />
      <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="password" name='password' placeholder='Password' autoComplete='off' />

      <span className='text-slate-800 text-center block text-sm'>{errMsg}</span>

      {loader && <Loader />}

      <button type='submit'>Login</button>
    </form>
  )
}


const Register = () => {

  const { errMsg, setErrMsg, loader, setLoader } = useContext(AppContext)

  const formRef = useRef()

  // url for profile image preview (blob)
  const [objectURL, setObjectURL] = useState("")


  const handleSubmit = e => {
    e.preventDefault()

    if ((formRef.current.fullname.value ||
      formRef.current.username.value ||
      formRef.current.email.value ||
      formRef.current.phone.value ||
      formRef.current.password.value) == "") {
      setErrMsg("Completa los campos vacios")
    } else {
      if (formRef.current.password.value !== formRef.current.passwordRepeat.value) {
        setErrMsg("Las contraseñas no coinciden. Por favor, intenta de nuevo.")
      } else {
        setLoader(true)
        const formData = new FormData()

        formData.append("profileImage", null || formRef.current.profileImage.files[0])
        formData.append("fullname", formRef.current.fullname.value)
        formData.append("username", formRef.current.username.value)
        formData.append("email", formRef.current.email.value)
        formData.append("phone", formRef.current.phone.value)
        formData.append("password", formRef.current.password.value)

        axios.post('http://localhost:5000/api/register', formData, { headers: { "Content-Type": "multipart/formdata" } })
          .then(res => {
            setErrMsg(res.data.message)
            setLoader(false)
            formRef.current.reset()
            setObjectURL("https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png")
          })
          .catch(err => {
            setErrMsg(err.message + "." + " Asegúrate de haber elegido una imagen de perfil.")
            setLoader(false)
          })
      }
    }
  }


  const handleProfileImage = e => {
    let url = URL.createObjectURL(e.target.files[0])
    setObjectURL(url)
  }

  return (
    <>
      <form ref={formRef} className='flex flex-col justify-center items-center gap-3 w-full' onSubmit={e => handleSubmit(e)}>
        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="text" name='fullname' placeholder='Fullname' autoComplete='off' />

        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="text" name='username' placeholder='Username' autoComplete='off' />

        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="email" name='email' placeholder='Email' autoComplete='off' />

        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="text" name='phone' placeholder='Phone' autoComplete='off' />

        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="password" name='password' placeholder='Password' autoComplete='off' />

        <input className='w-full p-2 border outline-none border-1 border-gray-400 rounded-lg focus:border-black hover:border-black' type="password" name='passwordRepeat' placeholder='Repeat password' autoComplete='off' />

        <input name='profileImage' hidden type="file" onChange={e => handleProfileImage(e)} accept='image/*' />

        <div className='w-full'>
          <div className='flex justify-start items-center gap-2'>
            <div>
              <img className='w-16 h-16 rounded-full object-cover' src={objectURL || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"} alt="a" />
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-sm text-slate-800'>Profile Image</span>
              <button onClick={() => formRef.current.profileImage.click()} type='button' className='p-2 hover:bg-gray-300 active:bg-gray-400 bg-gray-200'>{objectURL.length > 1 ? "Change profile image" : "Select profile image"}</button>
            </div>
          </div>
        </div>

        <span className='text-slate-800 text-center block text-sm'>{errMsg}</span>

        {loader && <Loader />}

        <button type='submit'>Register</button>
      </form>
    </>
  )
}