

import React, { useEffect, useState } from 'react';
import Loadere from '../www/ui/Loader/Loadere';
import { setActiveLink, setDebtors, setSignedOut } from '../redux/actionsMain';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import Debtor from '../component/Debtor/Debtor';
import NewDebtor from '../component/Debtor/NewDebtor';


function Debt(props) {
   const [showNewDebt, setShowNewDebt] = useState(false)
   const [nothing, setNothing] = useState(false)
   const [search, setSearch] = useState('')

   const token = localStorage.getItem('token')
   const user = localStorage.getItem('user')
   const debtors = useSelector(state => state.debtors)
   const baseURL = useSelector(state => state.baseURL)
   
   const dispatch = useDispatch()
   const navigate = useNavigate()


   useEffect(() => {
      dispatch(setActiveLink("Debt"))
      if (user) {
         fetch(`${baseURL}/debt/all`, {
            method: 'GET',
            headers: {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'GET',
               "Content-Type": "application/json",
               "auth-token": token
            }
         }).then(result => result.json()).then(data => {
            if (data.error) {
               dispatch(setSignedOut())
               return navigate('/signin')
            }
            if (!data.data.length) setNothing(true)
            dispatch(setDebtors(data.data))
         }).catch(ex => {
            console.log(ex)
         })
      }
      // eslint-disable-next-line
   }, [])


   if (!debtors.length && !nothing) return <Loadere />
   return (
      <div className='debt'>
         <button onClick={() => setShowNewDebt(true)} className='bta w-100 mb-1'>Yangi qarzdor</button>
         <input onChange={ee => setSearch(ee.target.value)} type="text" className='form-control' placeholder='izlash' required />
         {showNewDebt && <NewDebtor showNewDebt={showNewDebt} setShowNewDebt={setShowNewDebt} />}
         {nothing && <h5 className='nothing'>Hech narsa topilmadi</h5>}
         <div className='debtors-list'>
            {debtors.filter(debtor => (
               search === ""
                  ? debtor
                  : debtor.debtor.toLowerCase().includes(search.toLowerCase())
            )).map(debtor => (
               <Debtor debtor={debtor} key={debtor._id} />
            )).reverse()}
         </div>
      </div>
   );
}

export default Debt;