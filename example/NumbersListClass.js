import React from 'react'
import numbersProvider from './NumbersProvider.js'
import {StatefulComponent} from 'index'

export default class extends StatefulComponent{
    constructor(props){
        super({numbers: [], localTime: 0}, [numbersProvider], props)
    }

    render() {
        return <div>
            <div>Change The shared state:</div>
            <button onClick={()=>numbersProvider.loadNumber()}>load</button>

            <div>Change The local state:</div>
            <button onClick={()=>this.setState( { localTime: new Date().getTime() } )}> {this.state.localTime} </button>

            <div>Read the sharedState</div>
            <ul>
                {numbersProvider.hasNumbers()
                 ? this.state.numbers.map( n => <li key={n}> {n} </li> )
                 : <li>No Numbers</li>
                }
            </ul>
        </div>
    }
}