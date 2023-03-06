

import { createStore } from "redux";
import reducersMain from "./reducersMain";

const store = createStore(reducersMain, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store