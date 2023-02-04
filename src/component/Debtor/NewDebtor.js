

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../www/element/utils';
import '../../style/modal.scss'
import { setDebtors } from '../../redux/debtActions';

function NewDebtor({ showNewDebt, setShowNewDebt }) {
   const [debtor, setDebtor] = useState('')
   const [amount, setAmount] = useState('')
   const token = localStorage.getItem('token188')
   const inputRef = useRef()
   const dispatch = useDispatch()
   const debtors = useSelector(state => state.debtors)

   useEffect(() => {
      inputRef.current.focus()
   }, [])

   function addNewDebt(ee) {
      ee.preventDefault()

      setTimeout(() => {
         fetch('https://axror.onrender.com/debt/add', {
            method: "POST",
            headers: {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'POST',
               "Content-Type": "application/json",
               "auth-token": token
            },
            body: JSON.stringify({ debtor })
         }).then(result => result.json()).then(newDebtor => {
            console.log(newDebtor);

            fetch(`https://axror.onrender.com/debt/debtor/new/${newDebtor.data._id}`, {
               method: 'PUT',
               headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'PUT',
                  "Content-type": "application/json",
                  "auth-token": token
               },
               body: JSON.stringify({ amount, addedAt: Date.now() })
            }).then(result => result.json()).then(data => {
               if(data.error) return toastError(data.error)
               
               dispatch(setDebtors([...debtors, data.data]))

               toastSuccess(data.success)
               setShowNewDebt(false)
               setDebtor('')
               setAmount('')
            })
         }).catch(ex => console.log(ex))
      }, 500);
   }

   return (
      <div className="acmodal">
         <div className='acmodal__content'>
            <i onClick={() => setShowNewDebt(!showNewDebt)} className='bi bi-x-lg x-close'></i>

            <form onSubmit={ee => addNewDebt(ee)} className="acform">
               <h4 className='acform__title'>Yangi qarzdor</h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setDebtor(ee.target.value)} value={debtor} ref={inputRef} type="text" className="form-control" id="debtor" placeholder="ism" required />
                  <label htmlFor="debtor">ism</label>
               </div>
               <div>
                  <span></span>
               </div>
               <div className="form-floating mb-3">
                  <input onChange={ee => setAmount(ee.target.value)} value={amount} min="500" max="9999999" type="number" className="form-control" id="amount" placeholder="miqdor" required />
                  <label htmlFor="amount">miqdor</label>
               </div>
               <div className='modal-btns'>
                  <button type='button' className='btn btn-danger' onClick={() => setShowNewDebt(!showNewDebt)}>yopish</button>
                  <button type='submit' className="bta">qo'shish</button>
               </div>
            </form>

         </div>
      </div>
   );
}

export default NewDebtor;