

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryGoods, setCategoryGoodsToNull, setGoods } from '../redux/actionsMain';
import { numberWithCommas, toastSuccess } from '../www/element/utils';
import { useNavigate, useParams } from 'react-router';
import Loadere from '../www/ui/Loader/Loadere';
import moment from 'moment';
import 'moment/locale/uz-latn'
moment.locale("uz-latn")

function CategoryGoods(props) {
   const [search, setSearch] = useState('')
   const [options, setOptions] = useState(false)
   const [goodsId, setGoodsId] = useState('')
   const [showRemoveCategory, setShowRemoveCategory] = useState(false)

   const [showConfirmDelete, setShowConfirmDelete] = useState(false)
   const [showEditGoods, setShowEditGoods] = useState(false)
   const [showPurchased, setShowPurchased] = useState(false)

   const [goodsName, setGoodsName] = useState('')
   const [goodsPrice, setGoodsPrice] = useState('')
   const [goodsPurchased, setGoodsPurchased] = useState('')
   const [goodsCategory, setGoodsCategory] = useState('')


   const token = localStorage.getItem('token')
   const goods = useSelector(state => state.goods)
   const catGoods = useSelector(state => state.categoryGoods)
   const categories = useSelector(state => state.categories)
   const baseURL = useSelector(state => state.baseURL)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { name } = useParams()
   const [nothing, setNothing] = useState(false)


   useEffect(() => {
      dispatch(setCategoryGoodsToNull())
      fetch(`${baseURL}/goods/category/${name}`, {
         method: 'get',
         headers: {
            "Content-Type": "application/json",
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {

         if (!data.data.length) setNothing(true)
         dispatch(setCategoryGoods(data.data))

      }).catch(ex => console.log(ex))

      // eslint-disable-next-line
   }, [name])

   function removeGoods(goodsId) {
      fetch(`${baseURL}/goods/remove/${goodsId}`, {
         method: "delete",
         headers: {
            "Content-Type": "application/json",
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {
         console.log(data);
         setOptions(false)
         const newArray = goods.filter(item => item._id !== data.data._id)
         const newArray1 = catGoods.filter(item => item._id !== data.data._id)

         dispatch(setGoods(newArray))
         dispatch(setCategoryGoods(newArray1))
         toastSuccess(data.success)
      }).catch(ex => console.log(ex))
   }

   function editGoodsInfo(goodsId) {
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
         const newArray1 = catGoods.map(item => {
            if (item._id === data.data._id) return data.data
            return item
         })
         dispatch(setGoods(newArray))
         dispatch(setCategoryGoods(newArray1))

         controlOptions()
         toastSuccess(data.success)
      }).catch(ex => console.log(ex))
   }

   function removeCategory() {
      fetch(`${baseURL}/category/${name}`, {
         method: "delete",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            "Content-Type": "application/json",
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {
         navigate('/goods')

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


   if (!catGoods.length && !nothing) return <Loadere />
   return (
      <div onClick={closeOptions} className='goods'>
         <div className='d-flex'>
            <input onChange={ee => setSearch(ee.target.value)} value={search} type="text" className='form-control' placeholder='izlash' required />
         </div>
         {nothing && <h5 className='nothing'>Hech narsa topilmadi</h5>}

         <div className='goods__list'>
            {catGoods.filter(item => (
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
                                 <textarea onChange={ee => setGoodsName(ee.target.value)} value={goodsName} placeholder={item.name} type="text" className='form-control py-1' required></textarea>
                                 <div className='d-flex gap-1'>
                                    <input onChange={ee => setGoodsPurchased(ee.target.value)} value={goodsPurchased} placeholder={item.purchased} type="number" className='form-control py-1' required />
                                    <input onChange={ee => setGoodsPrice(ee.target.value)} value={goodsPrice} placeholder={item.price} type="number" className='form-control py-1' required />
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
         <div className='remove-category'>
            <button onClick={() => setShowRemoveCategory(!showRemoveCategory)}>Toifani O'chirish</button>
            {showRemoveCategory && <>
               <i className='bi bi-arrow-right'></i>
               <button onClick={removeCategory} className="bred">O'chirish</button>
            </>
            }
         </div>

      </div>


      // <div onClick={() => closeOptions()} className='goods'>
      //    <div className='d-flex'>
      //       <input onChange={ee => setSearch(ee.target.value)} value={search} type="text" className='form-control' placeholder='Search' required />
      //    </div>
      //    {nothing && <h5 className='nothing'>Hech narsa topilmadi</h5>}
      //    <div className='goods__list'>
      //       {catGoods.filter(item => (
      //          search === ''
      //             ? item
      //             : item.name.toLowerCase().includes(search.toLowerCase())
      //       )).map(item => (
      //          <div className={options && goodsId === item._id ? "goods__item goods__item_expand" : 'goods__item'} key={item._id}>
      //             <div className='goods__item__main'>
      //                <span className='goods__item__name'>{item.name}</span>
      //                <span className='goods__item__price'>{numberWithCommas(item.price)}</span>

      //                <i onClick={ee => controlOptions(ee, item._id)} className="goods__item__options bi bi-list red8"></i>

      //                {options && goodsId === item._id && <div onClick={ee => ee.stopPropagation()} className="goods__options noget">
      //                   <div className='goods__options__main'>
      //                      <h6 onClick={() => removeGoods(item._id)}> <i className='bi bi-trash cred'></i> Delete</h6>
      //                      <h6 onClick={() => controlEditGoods(item)}> <i className='bi bi-pen-fill'></i> Edit</h6>
      //                   </div>
      //                   {editGoods &&
      //                      <div className='goods__options__edit'>
      //                         <textarea onChange={ee => setGoodsName(ee.target.value)} value={goodsName} placeholder={item.name} type="text" className='form-control py-1' required></textarea>
      //                         <input onChange={ee => setGoodsPrice(ee.target.value)} value={goodsPrice} placeholder={item.price} type="number" className='form-control py-1' required />
      //                         <button onClick={() => editGoodsInfo(item._id)} type='button' className='bta bgreen py-1'>Save</button>
      //                      </div>
      //                   }
      //                </div>}
      //             </div>
      //          </div>
      //       )).reverse()}
      //    </div>
      // </div>
   );
}

export default CategoryGoods;