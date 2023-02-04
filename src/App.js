

import React from "react";
import MainApp from "./MainApp";
import "./style/esta.scss";
import "./style/initial.scss";
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css'
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";


function App() {
	return (
		<div className="App">
			<BrowserRouter>
			<ToastContainer  transition={Zoom} />
				<MainApp />
			</BrowserRouter>
		</div>
	);
}

export default App;
