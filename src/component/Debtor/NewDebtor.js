

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../www/element/utils';
import '../../style/modal.scss'
import { setDebtors } from '../../redux/actionsMain';
import Loadere from '../../www/ui/Loader/Loadere';


function NewDebtor({ showNewDebt, setShowNewDebt }) {
   const [debtor, setDebtor] = useState('')
   const [amount, setAmount] = useState('')
   const [loading, setLoading]= useState(false)

   const token = localStorage.getItem('token')
   const debtors = useSelector(state => state.debtors)
   const baseURL = useSelector(state => state.baseURL)
   
   const inputRef = useRef()
   const dispatch = useDispatch()


   useEffect(() => {
      inputRef.current.focus()
   }, [])

   function addNewDebt(ee) {
      ee.preventDefault()
      setLoading(true)

      if(amount.length < 3 || amount.length > 300 || debtor.length < 5 || debtor.length > 100) return

      setTimeout(() => {
         fetch(`${baseURL}/debt/add`, {
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

            fetch(`${baseURL}/debt/debtor/new/${newDebtor.data._id}`, {
               method: 'PUT',
               headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'PUT',
                  "Content-type": "application/json",
                  "auth-token": token
               },
               body: JSON.stringify({ amount, addedAt: Date.now() })
            }).then(result => result.json()).then(data => {
               if (data.error) return toastError(data.error)

               dispatch(setDebtors([...debtors, data.data]))

               setLoading(false)
               toastSuccess(data.success)
               setShowNewDebt(false)
               setDebtor('')
               setAmount('')
            })
         }).catch(ex => {
            setLoading(false)
            console.log(ex)
         })
      }, 500);
   }

   
   return (
      <div className="acmodal">
         <div className='acmodal__content'>
            <i onClick={() => setShowNewDebt(!showNewDebt)} className='bi bi-x-lg x-close'></i>

            <form onSubmit={ee => addNewDebt(ee)} className="acform">
               <h4 className='acform__title'>Yangi qarzdor</h4>
               <div className="form-floating mb-3">
                  <input onChange={ee => setDebtor(ee.target.value)} value={debtor} ref={inputRef} type="text" minLength="5" maxLength="100" className="form-control" id="debtor" placeholder="ism" required />
                  <label htmlFor="debtor">ism</label>
               </div>
               <div>
                  <span></span>
               </div>
               <div className="form-floating mb-3">
                  <textarea onChange={ee => setAmount(ee.target.value)} value={amount} type="text" minLength="3" maxLength="300" className="form-control" id="amount" placeholder="miqdor" required />
                  <label htmlFor="amount">miqdor</label>
               </div>
               <div className='modal-btns'>
                  <button type='button' className='btn btn-danger' onClick={() => setShowNewDebt(!showNewDebt)}>yopish</button>
                  <div className='signin-loading'>
                     {loading && <div> <Loadere /> </div>}
                     <button type='submit' className="bta">qo'shish</button>

                  </div>
               </div>
            </form>

         </div>
      </div>
   );
}

export default NewDebtor;