

function setSignedIn(user) {
   return { type: "SET_SIGNED_IN", payload: user }
}
function setSignedOut() {
   return { type: "SET_SIGNED_OUT" }
}
function setDebtors(debtors) {
   return { type: "SET_DEBTORS", payload: debtors }
}
function addNewDebtor(debtor) {
   return { type: "ADD_NEW_DEBTOR", payload: debtor }
}
function setCategories(categories) {
   return { type: "SET_CATEGORIES", payload: categories }
}
function setGoods(goods) {
   return { type: "SET_GOODS", payload: goods }
}
function setCategoryGoods(goods) {
   return { type: "SET_GOODS_BY_CATEGORY", payload: goods }
}
function setCategoryGoodsToNull() {
   return { type: "SET_CATEGORY_GOODS_TO_NULL" }
}
function setActiveLink(link) {
   return { type: "SET_ACTIVE_LINK", payload: link }
}

export {
   setSignedIn, setSignedOut, setDebtors, addNewDebtor,
   setCategories, setGoods, setCategoryGoods, setCategoryGoodsToNull,
   setActiveLink
}
