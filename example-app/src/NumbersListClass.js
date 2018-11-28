import React from 'react'
import {StatefulComponent} from 'react-stator'
import numbersProvider from './NumbersProvider'
import NumberListItemClass from './NumberListItemClass'
import SelectionProvider from './SelectGroupProvider'

export default class extends StatefulComponent{
    constructor(props){
        super({numbers: [], localTime: new Date().getTime()},[numbersProvider], props)
        this.selectionProvider = new SelectionProvider()
    }

    render() {
        return <div>
            <h2>Change The shared state:</h2>
            <button onClick={()=>numbersProvider.loadNumber()}>load</button>

            <h2>Change The local state:</h2>
            <button onClick={()=>this.setState( { localTime: new Date().getTime() } )}> {this.state.localTime} </button>

            <h2>Read the sharedState</h2>
            <ul>
                {numbersProvider.hasNumbers()
                 ? this.state.numbers.map( n =>
                        <NumberListItemClass selectionProvider={this.selectionProvider} id={n}/>
                    )
                 : <li>No Numbers</li>
                }
            </ul>
        </div>
    }
}