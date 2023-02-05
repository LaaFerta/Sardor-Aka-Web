

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NewCategory from '../component/Category/NewCategory';
import NewGoods from '../component/Goods/NewGoods';
import { setActiveLink, setCategories } from '../redux/debtActions';
import Loadere from '../www/ui/Loader/Loadere';


function Home(props) {
   const [modalGoods, setModalGoods] = useState(false)
   const [modalCategory, setModalCategory] = useState(false)
   const token = localStorage.getItem('token188')
   const categories = useSelector(state => state.categories)
   const dispatch = useDispatch()
   const [nothing, setNothing] = useState(false)
   const navigate = useNavigate()


   useEffect(() => {
      dispatch(setActiveLink('Home'))
      fetch('https://upset-sandals-colt.cyclic.app/category/all', {
         method: "GET",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            "Content-Type": 'application/json',
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {

         if (data.error) return navigate('/signin')
         dispatch(setCategories(data.data))
         if (!data.data.length) setNothing(true)
         
      }).catch(ex => {
         console.log(ex);
      })
      // eslint-disable-next-line
   }, [])


   if (!categories.length && !nothing) return <Loadere />
   return (
      <div className='home'>
         <button onClick={() => setModalGoods(!modalGoods)} className='bta w-100 mb-2'>Yangi tovar</button>
         <button onClick={() => setModalCategory(!modalCategory)} className='bta w-100'>Yangi toifa</button>
         {modalGoods && <NewGoods modalGoods={modalGoods} setModalGoods={setModalGoods} />}
         {modalCategory && <NewCategory modalCategory={modalCategory} setModalCategory={setModalCategory} />}

         {nothing && <h5 className='nothing'>Hech narsa topilmadi</h5>}
         <div className='categories'>
            {categories.sort((a, b) => a - b).map(cat => (
               <Link to={`/category/${cat.catName}`} key={cat._id} className="blink categories__link">
                  <h5 key={cat._id}>{cat.catName}</h5>
                  <i className='bi bi-arrow-right'></i>
               </Link>
            ))}
         </div>
      </div>
   );
}


export default Home;