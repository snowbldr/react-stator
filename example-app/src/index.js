import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NumberList from './NumbersListClass'
import numbersList from './NumbersListFunction'
import NumbersProvider from './NumbersProvider'
import {registerRootProvider} from "react-stator";

registerRootProvider(new NumbersProvider())

ReactDOM.render(
    <div id="app">
        <NumberList/>
        {numbersList()}
    </div>,
    document.getElementById('root'))
