

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../../redux/debtActions';
import Loadere from '../../www/ui/Loader/Loadere';


function NewCategory({ modalCategory, setModalCategory }) {
   const [catName, setCatName] = useState('')
   const [loading, setLoading] = useState(false)
   const token = localStorage.getItem('token188')
   const inputRef = useRef()
   const dispatch = useDispatch()
   const categories = useSelector(state => state.categories)


   useEffect(() => {
      inputRef.current.focus()
   }, [])

   function addCategory(ee) {
      ee.preventDefault()
      if (catName.length < 3 && catName > 50) return
      setLoading(true)

      fetch('https://upset-sandals-colt.cyclic.app/category/add', {
         method: 'POST',
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            "Content-Type": 'application/json',
            "auth-token": token
         },
         body: JSON.stringify({ catName })
      }).then(result => result.json()).then(data => {

         setLoading(false)
         dispatch(setCategories([...categories, data.data]))
         setCatName('')
         setModalCategory(false)

      }).catch(ex => {
         console.log(ex)
         setLoading(false)
      })
   }

   
   return (
      <div className="acmodal">
         <div className='acmodal__content'>
            <i onClick={() => setModalCategory(!modalCategory)} className='bi bi-x-lg x-close'></i>

            <form onSubmit={ee => addCategory(ee)} className="acform">
               <h4 className='acform__title'>Yangi toifa </h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setCatName(ee.target.value)} value={catName} ref={inputRef} type="text" min="3" max="70" className="form-control" id="category" placeholder="toifa" required />
                  <label htmlFor="category">toifa</label>
               </div>
               <div className='modal-btns'>
                  <button type='button' className='btn btn-danger' onClick={() => setModalCategory(!modalCategory)}>yopish</button>
                  <div className='acform__loading'>
                     {loading && <div> <Loadere /> </div>}
                     <button type='submit' className="bta">qo'shish</button>
                  </div>
               </div>
            </form>

         </div>
      </div>
   );
}

export default NewCategory;