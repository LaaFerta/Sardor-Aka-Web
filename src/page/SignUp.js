

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toastError, toastSuccess } from '../www/element/utils';


function SignUp(props) {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const navigate = useNavigate()

   function signup(ee) {
      ee.preventDefault()
      fetch('https://upset-sandals-colt.cyclic.app/auth/signup', {
         method: "post",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify({username, password})
      }).then(result => result.json()).then(data => {
         if(data.error) return toastError(data.error)

         toastSuccess(data.success)
         navigate('/signin')
         setUsername('')
         setPassword('')

      }).catch(ex => {
         toastError("Serverda xatolik yuz berdi")
         console.log(ex);
      })
   }

   return (
      <div>
         <div className='sign-up all-sign'>
            <form onSubmit={ee => signup(ee)} className="sign-form">
               <h4 className="text-center form-title">Ro'yhatdan o'tish</h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setUsername(ee.target.value)} value={username} type="text" className="form-control" id="username2" placeholder="username" required />
                  <label htmlFor="username2">Username</label>
               </div>
               <div className="form-floating mb-3">
                  <input onChange={ee => setPassword(ee.target.value)} value={password} type="password" className="form-control" id="password2" placeholder="password" required />
                  <label htmlFor="password2">Password</label>
               </div>
               <div className="signin-loading">
                  <button type='submit' className="bta px-4">O'tish</button>
               </div>
            </form>
         </div>
         <div className='text-center mt-5 dont-account'>
            <p  className='mb-1'>Hisobingiz bormi! </p>
            <Link className='e-link' to='/signin'> Kirish</Link>
         </div>
      </div>
   );
}

export default SignUp;