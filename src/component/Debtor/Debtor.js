

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDebtors } from '../../redux/debtActions';
import { numberWithCommas, toastSuccess } from '../../www/element/utils';
import NewDebtForm from './NewDebtForm';


function Debtor({ debtor }) {
   const [expand, setExpand] = useState(false)
   const [options, setOptions] = useState(false)
   const [removeConfirm, setRemoveConfirm] = useState(false)
   const token = localStorage.getItem('token188')
   const debtors = useSelector(state => state.debtors)
   const dispatch = useDispatch()


   function removeDebtor(debtorId) {
      fetch(`https://axror.onrender.com/debt/remove/${debtorId}`, {
         method: "DELETE",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            "auth-token": token
         }
      }).then(result => result.json()).then(data => {
         toastSuccess(data.success)
         const newArray = debtors.filter(dbt => dbt._id !== data.data._id)
         dispatch(setDebtors(newArray))
      }).catch(ex => console.log(ex))
   }

   function removeSingleDebt(debtorId, debtId) {
      fetch(`https://axror.onrender.com/debt/debtor/${debtorId}`, {
         method: "PUT",
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            "Content-Type": "application/json",
            "auth-token": token
         },
         body: JSON.stringify({ debtId })
      }).then(result => result.json()).then(data => {

         const newArray = debtors.map(dbt => {
            if (dbt._id === data.result._id) return data.result
            return dbt
         })
         dispatch(setDebtors(newArray))

         if (data.result.debts.length === 0) {
            fetch(`https://axror.onrender.com/debt/remove/${debtorId}`, {
               method: "DELETE",
               headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'DELETE',
                  "Content-Type": "application/json",
                  "auth-token": token
               }
            }).then(result => result.json()).then(data => {
               const newArray = debtors.filter(dbt => dbt._id !== data.result._id)
               dispatch(setDebtors(newArray))
            }).catch(ex => console.log(ex))
         }
      }).catch(ex => console.log(ex))
   }

   const totalPrice = debtor.debts.reduce((total, debt) => {
      return total + debt.amount
   }, 0)

   function controlOptions() {
      setOptions(!options)
      setRemoveConfirm(false)
   }
   function controlExpand() {
      setOptions(false)
      setExpand(false)
   }

   return (
      <div className={expand ? 'debtor expand-debt' : 'debtor'}>
         {expand && <i onClick={controlExpand} className='bi bi-x-lg x-close'></i>}
         {expand && <div onClick={() => controlOptions()} className='debtor__options'>
            <span></span><span></span><span></span>
            {options && <div onClick={ee => ee.stopPropagation()} className="debtor__options_list noget">
               <h6 onClick={() => setRemoveConfirm(!removeConfirm)}> <i className='bi bi-trash cred'></i> O'chirish</h6>
               {removeConfirm && <h6 onClick={() => removeDebtor(debtor._id)}>O'chirish</h6>}

            </div>}
         </div>}
         <h6 className='text-center debtor__name'>{debtor.debtor}</h6>
         <hr />
         <div className='debtor-debt'>
            {debtor.debts.length !== 0 ? debtor.debts.slice(0, expand ? 9999 : 4).map(debt => (
               <div className='userdebt-item' key={debt._id}>
                  {numberWithCommas(debt.amount)} {expand && <i onClick={() => removeSingleDebt(debtor._id, debt._id)} className='bi bi-x'></i>}
               </div>
            )) : <p className='text-center'>no debt yet</p>}
         </div>
         <div className='newdebtform'>
            {expand
               ? <NewDebtForm debtorId={debtor._id} totalPrice={totalPrice} />
               : <button onClick={() => setExpand(true)} className='bta bt1 py-0'>ochish</button>
            }
         </div>
      </div>
   );
}

export default Debtor;