

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router';
import { setSignedIn, setSignedOut } from '../redux/debtActions';
import SignIn from './SignIn';
import SignUp from './SignUp';

function Protector(props) {
   const dispatch = useDispatch()

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user188'))

      if (user) dispatch(setSignedIn(user))
      else {
         dispatch(setSignedOut())
         // navigate('/signin')
      }
      // eslint-disable-next-line
   }, [])

   const navigate = useNavigate()
   const isAuth = useSelector(state => state.isAuth) 
   return isAuth ? <Outlet /> : <SignIn />
}

export default Protector;