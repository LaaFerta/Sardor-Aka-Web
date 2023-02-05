

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Navbar(props) {
   const isAuth = useSelector(state => state.isAuth)
   const activeLink = useSelector(state => state.activeLink)

   return (
      <div className='navCona'>
         <nav className='header'>
            <div className='brand-cona'>
               <Link to="/">
                  <h3 className={activeLink === "Home" ? "active-link nav-brand" : "nav-brand"}>188</h3>
               </Link>
            </div>
            <ul className='nav-ul-list'>
               {isAuth
                  ? <>
                     <Link className={activeLink === "Goods" ? "active-link" : undefined} to="/goods">Tovarlar</Link>
                     <Link className={activeLink === "Debt" ? "active-link" : undefined} to="/debt">Qarzlar</Link>
                  </>
                  : <Link to="/signin">Kirish</Link>
               }
            </ul>
         </nav>
      </div>
   );
}

export default Navbar;