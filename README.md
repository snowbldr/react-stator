# Stateful Components
###### \- u can haz state

There are just three main concepts tp understand stateful components.
 - Local State
 - Shared State
 - Shared State Provider


### Local State
This is the classic state in react. That is, an object that when changed triggers the component to be rendered again
with the new values.

### Shared State
The same as local state, except that it's a property that is shared amongst multiple components instead of only being
attached to only one component. 

### Shared State Provider
An instance of the SharedStateProvider class. Each instance holds one shared state, so you can create multiple instances to
use in multiple contexts if you want to.

## Changing State
To change the state in you app, you have access to a couple of functions that work exactly like reacts setState
- Local State: 

   Use either this.setState(newState) for component classes or props.applyLocalState(newState) for functional components
- Shared State:

    Your provider has a function called applySharedState. This will only modify the state for the specific instance
    it's called on. You can use this directly or make functions on your provider that modify the state. It's recommended
    to only write to the state from your provider, just to make it more obvious when state is changing. You can also
    make functions to read or verify shared state if you want to keep all your stateful actions together in one place.


#### Example SharedStateProvider
    
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
    
    //note the "new" making this a singleton
    export default new NumbersProvider({ number: [] })


#### Example stateful functional component

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

#### Example stateful class component

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
