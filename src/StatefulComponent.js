import React from 'react'
import paths from './ObjectPaths'
import uuid from 'uuid/v4'

/**
 * A react component with a state that it isn't afraid to use
 */
export class StatefulComponent extends React.Component {
    /**
     * @param initialState The initial state of the this component
     * @param providers SharedStateProviders that will provide values for shared state
     * @param props The react props for this component
     */
    constructor( initialState, providers, props ) {
        super( props )
        this.state = initialState
        this.providers = providers
        if( providers && !Array.isArray( providers ) ) this.providers = [ this.providers ]
        this.listenPaths = paths.toPaths( initialState )
    }

    /**
     * If you override this, make sure you add a call to super or your state won't work anymore.
     *
     * Once the component is mounted we can get our state hooked up to the providers.
     */
    componentDidMount() {
        let updateOn = ( path ) => ( val ) => {
            paths.putPath( path, this.state, val )
            this.setState( this.state )
        }
        this.listenerMutes = this.providers && this.listenPaths.flatMap(
            path => this.providers
                        .filter(
                            p => p.canProvide( path )
                        )
                        .map(
                            provider => provider.listen( path, updateOn( path ).bind( this ) )
                        )
        )
    }

    /**
     * Cleanup all of our listeners before we unmount to avoid memory leaks
     */
    componentWillUnmount() {
        this.listenerMutes.forEach( mute => mute() )
    }
}

/**
 * create a Functional component with a state.
 * @param initialState The initial state of the this component
 * @param providers SharedStateProviders that will provide values for shared state
 * @param render The render method to use when rendering. This is your regular functional component. (props)=>{}
 * @returns {function(*=)} The stateful functional component
 */
export const stateful = ( initialState, providers, render ) => {
    class funny extends StatefulComponent {
        constructor( props ) {
            super( initialState, providers, props )
            const applyLocalState = ( ...args ) => this.setState( ...args )
            this.applyLocalState = applyLocalState.bind( this )
        }

        render() {
            return render( { ...this.props, state: this.state, applyLocalState: this.applyLocalState } )
        }
    }

    return ( props ) => React.createElement( funny, { ...props, key: ( props && props.key ) || uuid() } )
}
