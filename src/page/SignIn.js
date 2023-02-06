

import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setSignedIn } from '../redux/debtActions';
import { toastError, toastSuccess } from '../www/element/utils';
import Loadere from '../www/ui/Loader/Loadere';

function SignIn(props) {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const baseURL = useSelector(state => state.baseURL)


   async function signinControl(ee) {
      ee.preventDefault()
      setLoading(true)

      fetch(`${baseURL}/auth/signin`, {
         method: "post",
         headers: {
            "mode": "no-cors",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'post',
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ username, password })
      }).then(result => result.json()).then(data => {
         if (data.error) return toastError(data.error)

         setLoading(false)
         dispatch(setSignedIn(data.user))

         navigate('/')
         toastSuccess(data.success)
         localStorage.setItem('token188', data.token)
         localStorage.setItem('user188', JSON.stringify(data.user))

         setUsername('')
         setPassword('')

      }).catch(ex => {
         setLoading(false)
         console.log(ex)
         toastError("Serverda xatolik yuz berdi")
      })
   }


   return (
      <div>
         <div className='sign-in all-sign'>
            <form onSubmit={ee => signinControl(ee)} className="sign-form">
               <h4 className="text-center form-title">Hisobga kirish</h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setUsername(ee.target.value)} value={username} type="text"
                     className="form-control" id="username" placeholder="username" required />
                  <label htmlFor="name">Username</label>
               </div>
               <div className="form-floating mb-3">
                  <input onChange={ee => setPassword(ee.target.value)} value={password} type="password"
                     className="form-control" id="password1" placeholder="password" required />
                  <label htmlFor="password1">Password</label>
               </div>
               <div className='signin-loading'>
                  {loading && <div> <Loadere /> </div>}
                  <button type='submit' className="bta px-4">Kirish</button>
               </div>
            </form>
         </div>
         <div className='text-center mt-5 dont-account'>
            <p className='mb-1'> Hisobingiz yo'qmi? </p>
            <Link className='e-link' to='/signup'> Ro'yhatdan o'tish</Link>
         </div>
      </div>
   );
}

export default SignIn;