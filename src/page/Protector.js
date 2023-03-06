

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { setSignedIn, setSignedOut } from '../redux/actionsMain';
import SignIn from './SignIn';
import SignUp from './SignUp';


function Protector(props) {
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'))

      if (user) dispatch(setSignedIn(user))
      else {
         dispatch(setSignedOut())
         // navigate('/signin')
      }
      // eslint-disable-next-line
   }, [])

   const isAuth = useSelector(state => state.isAuth) 
   return isAuth ? <Outlet /> : location.pathname == "/signup" ? <SignUp /> : <SignIn />
}

export default Protector;