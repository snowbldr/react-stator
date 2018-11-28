import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NumberList from './NumbersListClass'
import numbersList from './NumbersListFunction'
import KeyValueListComponent from './KeyValueListComponent'

ReactDOM.render(
    <div id="app">
        {KeyValueListComponent()}
        <NumberList/>
        {numbersList()}
    </div>,
    document.getElementById('root'))
