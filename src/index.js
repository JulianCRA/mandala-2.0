import React from 'react';
import ReactDOM from "react-dom";

import App from './js/components/App'
import './styles/index.css';

const wrapper = document.getElementById("container");
//wrapper ? ReactDOM.render(<App name="Julian"/>, wrapper) : false;
ReactDOM.render(<App name="Julian"/>, wrapper)