import {stateful} from "react-stator";
import React from 'react'

export default (selectGroupProvider) => stateful({selectedId: null}, [selectGroupProvider],
    ({id}) =>
        <li>
            <button
                style={{"background-color":selectGroupProvider.isSelected(id) ? "green" : ""}}
                onClick={
                    ()=>selectGroupProvider.isSelected(id)
                        ? selectGroupProvider.clearSelection()
                        : selectGroupProvider.select(id)
                }
            >{id}</button>
        </li>
)