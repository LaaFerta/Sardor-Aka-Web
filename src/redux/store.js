

import { createStore } from "redux";
import debtReducers from "./debtReducers";

const store = createStore(debtReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store