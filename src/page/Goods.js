

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveLink, setGoods } from '../redux/debtActions';
import { numberWithCommas, toastSuccess } from '../www/element/utils';
import Loadere from '../www/ui/Loader/Loadere';



function Goods(props) {
   const [search, setSearch] = useState('')
   const [options, setOptions] = useState(false)
   const [goodsId, setGoodsId] = useState('')

   const [editGoods, setEditGoods] = useState(false)
   const [goodsName, setGoodsName] = useState('')
   const [goodsPrice, setGoodsPrice] = useState('')

   const token = localStorage.getItem('token188')
   const goods = useSelector(state => state.goods)
   const dispatch = useDispatch()
   const [nothing, setNothing] = useState(false)


   useEffect(() => {
      dispatch(setActiveLink("Goods"))
      fetch('https://axror.onrender.com/goods/all', {
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
      // eslint-disable-next-line
   }, [])

   function removeGoods(goodsId) {
      fetch(`https://axror.onrender.com/goods/remove/${goodsId}`, {
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
      fetch(`https://axror.onrender.com/goods/edit/${goodsId}`, {
         method: "PUT",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            "Content-Type": "application/json",
            "auth-token": token
         },
         body: JSON.stringify({ name: goodsName, price: +goodsPrice, updatedAt: Date.now() })
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
      setGoodsName(item.name)
      setGoodsPrice(item.price)
      setEditGoods(!editGoods)
   }

   function closeOptions() {
      setOptions(false)
      setEditGoods(false)
   }

   function controlOptions(ee, id) {
      if (ee) ee.stopPropagation()
      if (goodsId === id) {
         return setOptions(!options)
      }
      setGoodsId(id)
      setOptions(true)
      setEditGoods(false)
   }

   if (!goods.length && !nothing) return <Loadere />
   return (
      <div onClick={() => closeOptions()} className='goods'>
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
                              <h6 onClick={() => removeGoods(item._id)}> <i className='bi bi-trash cred'></i> O'chirish</h6>
                              <h6 onClick={() => controlEditGoods(item)}> <i className='bi bi-pen-fill'></i> Yangilash</h6>
                           </div>
                           {editGoods &&
                              <div className='goods__options__edit'>
                                 <textarea onChange={ee => setGoodsName(ee.target.value)} value={goodsName} placeholder={item.name} type="text" className='form-control py-1' required></textarea>
                                 <input onChange={ee => setGoodsPrice(ee.target.value)} value={goodsPrice} placeholder={item.price} type="number" className='form-control py-1' required />
                                 <button onClick={() => editGoodsInfo(item._id)} type='button' className='bta bgreen py-1'>Saqlash</button>
                              </div>
                           }
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