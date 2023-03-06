

const initialState = {
   isAuth: false,
   debtors: [],
   debtorsLoading: 'ready',
   user: null,
   categories: [],
   goods: [],
   categoryGoods: [],
   activeLink: undefined,
   // baseURL: "https://famous-dog-miniskirt.cyclic.app"
   baseURL: "http://localhost:1000"
}

function debtReducers(state = initialState, { type, payload }) {
   switch (type) {
      case "SET_SIGNED_IN":
         return {
            ...state,
            isAuth: true,
            user: payload
         }
      case "SET_SIGNED_OUT":
         localStorage.removeItem('token')
         localStorage.removeItem('user')
         return {
            ...state,
            isAuth: false,
            user: null
         }
      case "SET_DEBTORS":
         return {
            ...state,
            debtors: payload
         }
      case "SET_CATEGORIES":
         return {
            ...state,
            categories: payload
         }
      case "SET_GOODS":
         return {
            ...state,
            goods: payload
         }
      case "SET_GOODS_BY_CATEGORY":
         return {
            ...state,
            categoryGoods: payload
         }
         case "SET_CATEGORY_GOODS_TO_NULL":
            return {
               ...state,
               categoryGoods: []
            }
         case "SET_ACTIVE_LINK":
            return {
               ...state,
               activeLink: payload
            }
      default:
         return state
   }
}

export default debtReducers