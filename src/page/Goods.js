

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveLink, setCategories, setGoods } from '../redux/actionsMain';
import { numberWithCommas, toastSuccess } from '../www/element/utils';
import Loadere from '../www/ui/Loader/Loadere';
import moment from 'moment';
import 'moment/locale/uz-latn'
moment.locale("uz-latn")


function Goods(props) {
   const [search, setSearch] = useState('')
   const [goodsId, setGoodsId] = useState('')
   const [options, setOptions] = useState(false)

   const [showConfirmDelete, setShowConfirmDelete] = useState(false)
   const [showEditGoods, setShowEditGoods] = useState(false)
   const [showPurchased, setShowPurchased] = useState(false)

   const [goodsName, setGoodsName] = useState('')
   const [goodsPrice, setGoodsPrice] = useState('')
   const [goodsPurchased, setGoodsPurchased] = useState('')
   const [goodsCategory, setGoodsCategory] = useState('')

   const token = localStorage.getItem('token')
   const goods = useSelector(state => state.goods)
   const categories = useSelector(state => state.categories)
   const dispatch = useDispatch()
   const [nothing, setNothing] = useState(false)
   const baseURL = useSelector(state => state.baseURL)


   useEffect(() => {
      dispatch(setActiveLink("Goods"))
      fetch(`${baseURL}/goods/all`, {
         method: 'GET',
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            "Content-Type": "application/json",
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {
         if (!data.data.length) setNothing(true)

         dispatch(setGoods(data.data))
      }).catch(ex => console.log(ex))

      fetch(`${baseURL}/category/all`, {
         method: "GET",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            "Content-Type": 'application/json',
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {

         dispatch(setCategories(data.data))
         if (!data.data.length) setNothing(true)

      }).catch(ex => {
         console.log(ex);
      })

      // eslint-disable-next-line
   }, [])

   function removeGoods(goodsId) {
      fetch(`${baseURL}/goods/remove/${goodsId}`, {
         method: "DELETE",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            "Content-Type": "application/json",
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {
         setOptions(false)
         const newArray = goods.filter(gds => gds._id !== data.data._id)

         dispatch(setGoods(newArray))
         toastSuccess(data.success)
      }).catch(ex => console.log(ex))
   }

   function editGoodsInfo(goodsId) {
      if (goodsName.length > 70 || goodsName.length < 2 || +goodsPrice > 9999999 || +goodsPrice < 500 || +goodsPurchased > 9999999 || +goodsPurchased < 100 || !goodsCategory || goodsCategory === "toifa") return
      fetch(`${baseURL}/goods/edit/${goodsId}`, {
         method: "PUT",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            "Content-Type": "application/json",
            "auth-token": token
         },
         body: JSON.stringify({ name: goodsName, price: +goodsPrice, purchased: +goodsPurchased, category: goodsCategory, updatedAt: Date.now() })
      }).then(result => result.json()).then(data => {

         const newArray = goods.map(item => {
            if (item._id === data.data._id) return data.data
            return item
         })
         dispatch(setGoods(newArray))

         controlOptions()
         toastSuccess(data.success)
      }).catch(ex => console.log(ex))
   }

   function controlEditGoods(item) {
      setShowConfirmDelete(false)
      setShowPurchased(false)
      setGoodsName(item.name)
      setGoodsPrice(item.price)
      setGoodsPurchased(item.purchased)
      setGoodsCategory(item.category)
      setShowEditGoods(!showEditGoods)
   }

   function closeOptions() {
      setOptions(false)
      setShowConfirmDelete(false)
      setShowEditGoods(false)
      setShowPurchased(false)
   }

   function controlOptions(ee, id) {
      if (ee) ee.stopPropagation()
      if (goodsId === id) {
         return setOptions(!options)
      }
      setGoodsId(id)
      setOptions(true)
      setShowEditGoods(false)
      setShowPurchased(false)
      setShowConfirmDelete(false)
   }

   function controlPurchasedPrice() {
      setShowConfirmDelete(false)
      setShowEditGoods(false)
      setShowPurchased(!showPurchased)
   }

   function controlConfirmDelete() {
      setShowEditGoods(false)
      setShowPurchased(false)
      setShowConfirmDelete(!showConfirmDelete)
   }

   
   if (!goods.length && !nothing) return <Loadere />
   return (
      <div onClick={closeOptions} className='goods'>
         <div className='d-flex'>
            <input onChange={ee => setSearch(ee.target.value)} value={search} type="text" className='form-control' placeholder='izlash' required />
         </div>
         {nothing && <h5 className='nothing'>Hech narsa topilmadi</h5>}

         <div className='goods__list'>
            {goods.filter(item => (
               search === ''
                  ? item
                  : item.name.toLowerCase().includes(search.toLowerCase())
            )).map(item => (
               <div className={options && goodsId === item._id ? "goods__item goods__item_expand" : 'goods__item'} key={item._id} >
                  <div className='goods__item__main'>
                     <span className='goods__item__name'>{item.name}</span>
                     <span className='goods__item__price'>{numberWithCommas(item.price)}</span>

                     <i onClick={ee => controlOptions(ee, item._id)} className="goods__item__options bi bi-list red8"></i>

                     {options && goodsId === item._id &&
                        <div onClick={ee => ee.stopPropagation()} className="goods__options noget">
                           <div className='goods__options__main'>
                              <h6 onClick={() => controlConfirmDelete(item._id)}> <i className='bi bi-trash cred'></i> O'chirish</h6>
                              <h6 onClick={() => controlEditGoods(item)}> <i className='bi bi-pen-fill'></i> Yangilash</h6>
                              <h6 onClick={() => controlPurchasedPrice(item)}> <i className="bi bi-arrow-down-square-fill"></i> </h6>
                           </div>
                           {showConfirmDelete && <h6 onClick={ee => removeGoods(item._id)} className='goods__options__info cred'>O'chirish</h6>}

                           {showEditGoods &&
                              <div className='goods__options__info'>
                                 <textarea onChange={ee => setGoodsName(ee.target.value)} value={goodsName} placeholder={item.name} type="text" minLength={2} maxLength="70" className='form-control py-1' required></textarea>
                                 <div className='d-flex gap-1'>
                                    <input onChange={ee => setGoodsPurchased(ee.target.value)} value={goodsPurchased} placeholder={item.purchased} type="number" min="500" max="9999999" className='form-control py-1' required />
                                    <input onChange={ee => setGoodsPrice(ee.target.value)} value={goodsPrice} placeholder={item.price} type="number" min="500" max="9999999" className='form-control py-1' required />
                                 </div>
                                 <select onChange={ee => setGoodsCategory(ee.target.value)} className="form-select" required>
                                    <option value={item.category}>{item.category}</option>
                                    {categories.map(cat => (
                                       <option defaultValue={cat.catName} value={cat.catName} key={cat._id}>{cat.catName}</option>
                                    ))}
                                 </select>
                                 <button onClick={() => editGoodsInfo(item._id)} type='button' className='bta bgreen py-1'>Saqlash</button>
                              </div>
                           }
                           {showPurchased && <div className='goods__options__info'>
                              <span className='text-center'>Olingan narx: <strong>{numberWithCommas(item.purchased)}</strong> </span>
                              <span className='text-center'><i className='bi bi-calendar-date'> </i> {moment(item.updatedAt).format('LL')}</span>
                           </div>}
                        </div>
                     }
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Goods;