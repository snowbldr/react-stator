import React from 'react'
import paths from './ObjectPaths'
import uuid from 'uuid/v4'

export class StatefulComponent extends React.Component {
    constructor( initialState, providers, props ) {
        super( props )
        this.state = initialState
        this.providers = providers
        this.listenPaths = paths.toPaths( initialState )
    }

    componentDidMount() {
        let updateOn = ( path ) => ( val ) => {
            paths.putPath( path, this.state, val )
            this.setState( this.state )
        }
        this.listenerKeys = this.providers && Array.isArray( this.providers ) && this.listenPaths.flatMap(
            path => this.providers.filter( p => p.canProvide( path ) ).map(
                provider => ( { path, key: provider.listen( path, updateOn( path ).bind( this ) ), mute: provider.mute.bind( provider ) } )
            )
        )
    }

    componentWillUnmount() {
        this.listenerKeys.forEach( ( { path, key, mute } ) => mute( path, key ) )
    }
}

export const stateful = ( initialState, providers, render ) =>{
    class funny extends StatefulComponent {
        constructor( props ) {
            super( initialState, providers, props )
            const applyLocalState = ( ...args ) => this.setState( ...args )
            this.applyLocalState = applyLocalState.bind( this )
        }
        render(){
            return render( { ...this.props, state: this.state, applyLocalState: this.applyLocalState } )
        }
    }
    return ( props ) => React.createElement( funny, { ...props, key: ( props && props.key ) || uuid() } )
}
