

import React, { useEffect, useRef, useState } from 'react';
import { toastError, toastSuccess } from '../../www/element/utils';
import Loadere from '../../www/ui/Loader/Loadere';
import '../../style/modal.scss'
import { useDispatch, useSelector } from 'react-redux';
import { setGoods } from '../../redux/actionsMain';


function NewGoods({ modalGoods, setModalGoods }) {
   const [name, setName] = useState('')
   const [price, setPrice] = useState('')
   const [purchased, setPurchased] = useState('')
   const [category, setCategory] = useState('')
   const [loading, setLoading] = useState(false)

   const token = localStorage.getItem('token')
   const categories = useSelector(state => state.categories)
   const goods = useSelector(state => state.goods)
   const baseURL = useSelector(state => state.baseURL)
   
   const dispatch = useDispatch()
   const titleInputRef = useRef()


   useEffect(() => {
      titleInputRef.current.focus()
   }, [])

   function addGoods(ee) {
      ee.preventDefault()

      if (name.length > 70 || +price > 9999999 || +price < 500 || +purchased > 9999999 || +purchased < 100 || !category || category === "toifa") return
      setLoading(true)

      fetch(`${baseURL}/goods/add`, {
         method: 'post',
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            "Content-Type": 'application/json',
            "auth-token": token
         },
         body: JSON.stringify({ name, price: +price, purchased: +purchased, category, updatedAt: Date.now() })
      }).then(result => result.json())
         .then(data => {
            setLoading(false)
            if (data.error) return toastError(data.error)

            dispatch(setGoods([...goods, data.data]))
            setModalGoods(false)
            toastSuccess(data.success)

         }).catch(ex => {
            setLoading(false)
            console.log(ex);
         })
   }
   if (modalGoods) {
      document.body.style.overflow = 'hidden';
   }

   return (
      <div className="acmodal">
         <div className="acmodal__content">
            <i onClick={() => setModalGoods(!modalGoods)} className='bi bi-x-lg x-close'></i>

            <form onSubmit={ee => addGoods(ee)} className="acform">
               <h4 className='acform__title'>Yangi tovar</h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setName(ee.target.value)} value={name} ref={titleInputRef} type="text" minLength="2" maxLength="70" className="form-control" id="title" placeholder="tovar nomi" required />
                  <label htmlFor="title">tovar nomi</label>
               </div>
               <div className='d-flex gap-1'>
                  <div className="form-floating mb-3">
                     <input onChange={ee => setPurchased(ee.target.value)} value={purchased} type="number" min="500" max="9999999" className="form-control" id="price" placeholder="oliingan narx" required />
                     <label htmlFor="price">olingan narx</label>
                  </div>
                  <div className="form-floating mb-3">
                     <input onChange={ee => setPrice(ee.target.value)} value={price} type="number" min="500" max="9999999" className="form-control" id="price" placeholder="narx" required />
                     <label htmlFor="price">narx</label>
                  </div>
               </div>
               <div className="mb-3">
                  <select onChange={ee => setCategory(ee.target.value)} className="form-select" required>
                     <option value={"toifa"}>toifa</option>
                     {categories.map(cat => (
                        <option value={cat.catName} key={cat._id}>{cat.catName}</option>
                     ))}
                  </select>
               </div>

               <div className='modal-btns'>
                  <button type='button' className='btn btn-danger' onClick={() => setModalGoods(!modalGoods)}>yopish</button>
                  <div className='acform__loading'>
                     {loading && <div> <Loadere /> </div>}
                     <button className="bta">qo'shish</button>
                  </div>
               </div>
            </form>

         </div>
      </div>
   );
}

export default NewGoods;