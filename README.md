# React Stator

# THIS PROJECT IS ABANDONED!
don't use this, use hooks.

# Basics
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
A shared state provider is an instance that provides shared state to a component. Each instance has it's own state,
 so you can create multiple instances to use in multiple contexts if you want to.

## Reading State

To connect the component's state to the shared state, pass an initial state that has the same properties as the shared
state that you want to connect to. Once you've done that, you can access the properties using either:

`this.state` for react component classes that extend StatefulComponent 


`props.state` for functional components created using the stateful function

## Changing State
To change the state in your app, you have access to a couple of functions that work exactly like reacts setState
- Local State: 

   Use `this.setState(newState)` for component classes
   
   Use `props.applyLocalState(newState)` for functional components

- Shared State:

    Use the `this.applySharedState` method on the provider. This function patches the state, meaning it will only update
    the values of the properties provided to the function and will never remove properties.
     
    You can use this directly or make functions on your provider that modify the state. 
    
    It's recommended to only write to the state from your provider, to make it more obvious who is changing state.
    
    You can also make functions to read or verify shared state if you want to keep all your stateful actions together 
    in one place, though accessing this.state or props.state is perfectly fine

## Singleton Providers
You can make singleton providers to provide a shared state to your entire app by exporting an instance of an object in a file and 
importing that provider wherever you need it. 

For example you could have a file, mySharedStateProvider.js, that contained:

```js
export default new (class MySharedStateProvider extends SharedStateProvider {
    constructor(){
        super({mySharedState: {
                          hello: "world"
                      }})
    }
})()
```

Then import and use it in your component
```js
import React from 'react'
import {stateful} from 'react-stator'
import mySharedStateProvider from './MySharedStateProvider'

export default stateful(
    {mySharedState: {}},
    [mySharedStateProvider],
    ({state}) => <div> {state.mySharedState.hello} </div>
)
```

### Async State Initialization
If any value on the initial state or new state is a promise, we will automatically update the state to the resolved value once we receive it.

That is, 

`{ foo: Promise.resolve("hello world") }` 

becomes `{ foo: null }` before the promise resolves

then finally `{ foo: "hello world" }` when the promise resolves and we receive the value

### Examples
Below are some examples of using react-stator

You can also clone this repo, cd to example-app, and run `npm install && npm run start`.

#### Example SharedStateProvider
```js    
import {SharedStateProvider} from 'react-stator'

export default new (class NumbersProvider extends SharedStateProvider {
    
    constructor(){
        super({ numbers: [] })
        this.last = 1
    }
    
    loadNumber() {
        this.applySharedState({ numbers: this.state.numbers.concat([last++]) })
    }
    hasNumbers() {
        return this.state.numbers.length > 0
    }
})()
```


#### Example stateful functional component
```js
import React from 'react'
import NumbersProvider from './NumbersProvider.js'
import { stateful } from 'index'

export default stateful(
    { numbers: [], localTime: new Date().getTime() },
    [NumbersProvider],
    ( { state, applyLocalState } ) =>
        <div>

            <div>Change The shared state:</div>
            <button onClick={()=>NumbersProvider.loadNumber()}>load</button>

            <div>Change The local state:</div>
            <button onClick={()=>applyLocalState( { localTime: new Date().getTime() } )}> 
                {state.localTime} 
            </button>

            <div>Read the sharedState</div>
            <ul>
                {NumbersProvider.hasNumbers()
                 ? state.numbers.map( n => <li key={n}> {n} </li> )
                 : <li>No Numbers</li>
                }
            </ul>
        </div>
)
```

#### Example stateful class component

```js
import React from 'react'
import numbersProvider from './NumbersProvider.js'
import {StatefulComponent} from 'stateful-components'

export default class extends StatefulComponent{
   constructor(props){
       super({numbers: [], localTime: 0},[numbersProvider], props)
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
