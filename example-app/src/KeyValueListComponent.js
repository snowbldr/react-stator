import React from 'react'
import { stateful } from 'react-stator'
import KVStoreProvider from './KVStoreProvider'

const kvStore = new KVStoreProvider()

export default stateful(
    { store: {}, key: '', value: '', selected: "" },
    [ kvStore ],
    ( { state, applyLocalState } ) =>
        <div>
            <div>
                <span>key:</span>
                <input type="text" value={state.key} onChange={( e ) => applyLocalState( { key: e.target.value } )}/>
            </div>
            <div>
                <span>value:</span>
                <input type="text" value={state.value} onChange={( e ) => applyLocalState( { value: e.target.value } )}/>
            </div>
            <div>
                <button onClick={() => {
                    kvStore.put( state.key, state.value )
                    applyLocalState( { key: '', value: '' } )
                }}>Add
                </button>
            </div>
            <div>
                <div>Selected value: {kvStore.get(state.selected)}</div>
                <ul>
                    {kvStore.keys().map(k=><button onClick={()=>applyLocalState({selected: k})}>{k}</button>)}
                </ul>
            </div>
        </div>
)