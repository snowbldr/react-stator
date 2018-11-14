import React from 'react'
import {StatefulComponent} from "react-stator";

export default class extends StatefulComponent {

    constructor(props) {
        super({selectedId: null}, [props.selectionProvider], props)
        this.selectionProvider = props.selectionProvider
    }

    render() {
        return <li>
            <button style={{"background-color": this.selectionProvider.isSelected(this.props.id) ? "green" : ""}}
                    onClick={
                        () => this.selectionProvider.isSelected(this.props.id)
                            ? this.selectionProvider.clearSelection()
                            : this.selectionProvider.select(this.props.id)
                    }
            >
                {this.props.id}
            </button>
        </li>
    }

}