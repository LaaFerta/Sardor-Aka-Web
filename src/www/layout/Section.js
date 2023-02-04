

import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import CategoryGoods from '../../page/CategoryGoods';
import Debt from '../../page/Debt';
import Goods from '../../page/Goods';
import Home from '../../page/Home';
import Protector from '../../page/Protector';
import SignIn from '../../page/SignIn';
import SignUp from '../../page/SignUp';
import ErrorPage from '../ui/ErrorPage/ErrorPage';

function Section(props) {
   return (
      <div className='section'>
         <Routes>
            <Route element={<Protector />}>
               <Route path='/' element={<Home />} />
               <Route path='/goods' element={<Goods />} />
               <Route path='/debt' element={<Debt />} />
               <Route path='/signin' element={<SignIn />} />
               <Route path='/signup' element={<SignUp />} />
               <Route path='/category/:name' element={<CategoryGoods />} />
            </Route>


            <Route path='/error_page' element={<ErrorPage />} />
            <Route path='*' element={<Navigate to='/error_page' />} />
         </Routes>
      </div>
   );
}

export default Section;