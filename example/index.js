import React from 'react'
import ReactDOM from 'react-dom'
import NumberList from './NumbersListClass'
import numbersList from './NumbersListFunction'


ReactDOM.render(
    <div>
        <NumberList/>
        {numbersList()}
    </div>,
    document.getElementById('root'))