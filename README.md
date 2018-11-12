# React Stator
###### \- u can haz state

There are three components of react stator.
 - Local State
 - Shared State
 - Shared State Provider


### Local State
This is the classic state in react. That is, an object that when changed triggers the component to be rendered again
with the new values.

### Shared State
This is the same as local state, except that it's shared amongst multiple components instead of only one. 

### Shared State Provider
A shared state provider is an instance that provides shared state to the component. Each instance has it's own state,
 so you can create multiple instances to use in multiple contexts if you want to.

## Reading State

You can access both local and shared state through `this.state` or `props.state`

## Changing State
To change the state in your app, you have access to a couple of functions that work exactly like reacts setState
- Local State: 

   Use `this.setState(newState)` for component classes
   
   Use `props.applyLocalState(newState)` for functional components

- Shared State:

    Use the applySharedState method on the provider
     
    Tip: You can use this directly or make functions on your provider that modify the state. 
    
    It's recommended to only write to the state from your provider, to make it more obvious who is changing state.
    
    You can also make functions to read or verify shared state if you want to keep all your stateful actions together 
    in one place, though accessing this.state or props.state will 


#### Example SharedStateProvider
```JavaScript    
import {SharedStateProvider} from 'stateful-components'

let last = 1

class NumbersProvider extends SharedStateProvider {
    loadNumber() {
        //ultimately calls setState on each component with this provider
        this.applySharedState({ numbers: this.state.numbers.concat([last++]) })
    }
    hasNumbers() {
        this.state.numbers.length > 0            
    }
}

export default new NumbersProvider({ number: [] })
```


#### Example stateful functional component
```JavaScript
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
            <button onClick={()=>applyLocalState( { localTime: new Date().getTime() } )}> 
                {state.localTime} 
            </button>

            <div>Read the sharedState</div>
            <ul>
                {numbersProvider.hasNumbers()
                 ? state.numbers.map( n => <li key={n}> {n} </li> )
                 : <li>No Numbers</li>
                }
            </ul>
        </div>
)
```

#### Example stateful class component

```JavaScript
import React from 'react'
import numbersProvider from './NumbersProvider.js'
import {StatefulComponent} from 'stateful-components'

export default class extends StatefulComponent{
   constructor(props){
       super({numbers: [], localTime: 0}, [numbersProvider], props)
   }

   render() {
       return <div>
           <div>Change The shared state:</div>
           <button onClick={()=>numbersProvider.loadNumber()}>load</button>

           <div>Change The local state:</div>
           <button onClick={()=>this.setState( { localTime: new Date().getTime() } )}>
                {this.state.localTime} 
            </button>

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
```