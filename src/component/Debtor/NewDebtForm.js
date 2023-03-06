

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDebtors } from '../../redux/actionsMain';
import { numberWithCommas } from '../../www/element/utils';


function NewDebtForm({debtorId, totalPrice}) {
   const [amount, setAmount] = useState('')
   const token = localStorage.getItem('token')
   const [isDisable, setIsDisable] = useState(false)
   const dispatch = useDispatch()
   const debtors = useSelector(state => state.debtors)
   const baseURL = useSelector(state => state.baseURL)


   function addNewDebt(amount) {
      if(amount.length > 300 || amount.length < 3) return
      setIsDisable(true)
      fetch(`${baseURL}/debt/debtor/new/${debtorId}`, {
         method: 'PUT',
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            "Content-Type": "application/json",
            "auth-token": token
         },
         body: JSON.stringify({ amount, addedAt: Date.now() })
      }).then(result => result.json()).then(data => {
         setAmount('')
         const newArray = debtors.map(dbt => {
            if(dbt._id === data.data._id) return data.data
            return dbt
         })
         dispatch(setDebtors(newArray))
         setIsDisable(false)
      }).catch(ex => console.log(ex))
   }

   
   return (
      <div className='newdebtform-inner'>
         <div className='newdebtfor__text'>
            <textarea onChange={ee => setAmount(ee.target.value)} value={amount} type="text" minLength="3" maxLength="300" placeholder='miqdor' required />
         </div>
         <button onClick={() => addNewDebt(amount)} type="submit" className='bta py-1' disabled={isDisable}>+++</button>
      </div>
   );
}

export default NewDebtForm;