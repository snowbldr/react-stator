import React from 'react'
import numbersProvider from './NumbersProvider.js'
import { stateful } from 'index'

export default stateful(
    { numbers: [], localTime: new Date().getTime() }, [ numbersProvider ],
    ( { state, applyLocalState } ) =>
        <div>

            <div>Change The shared state:</div>
            <button onClick={()=>numbersProvider.loadNumber()}>load</button>

            <div>Change The local state:</div>
            <button onClick={()=>applyLocalState( { localTime: new Date().getTime() } )}> {state.localTime} </button>

            <div>Read the sharedState</div>
            <ul>
                {numbersProvider.hasNumbers()
                 ? state.numbers.map( n => <li key={n}> {n} </li> )
                 : <li>No Numbers</li>
                }
            </ul>
        </div>
)