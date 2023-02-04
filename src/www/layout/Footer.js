

import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { setSignedOut } from '../../redux/debtActions';

function Footer(props) {
   const dispatch = useDispatch()
   const isAuth = useSelector(state => state.isAuth)

   return (
      <footer className='footer'>
         {isAuth && <h6 onClick={() => dispatch(setSignedOut())} className='footer__signout'>Chiqish</h6>}
         <h6 className='footer-brand'>by DEVISS</h6>
      </footer>
   );
}

export default Footer;