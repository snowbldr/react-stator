import React from 'react'
import paths from './ObjectPaths'
import uuid from 'uuid/v4'

/**
 * A react component with a state that it isn't afraid to use
 */
export class StatefulComponent extends React.Component {
    /**
     * @param initialState The initial state of the this component
     * @param providers SharedStateProviders that will provide values for shared state. This is mostly used where you
     *          want to share state only between a set of components.
     * @param props The react props for this component
     */
    constructor( initialState, providers, props ) {
        if( !props && ( providers && !Array.isArray( providers ) ) ) {
            props = providers
            providers = []
        }
        super( props )
        this.state = initialState
        this.providers = providers
        if( providers && !Array.isArray( providers ) ) this.providers = [ this.providers ]
        this.providers.forEach( p => {
            if( typeof p !== 'object' ) {
                throw 'You supplied a provider that is not an instance of an object. Make sure you did: new Provider()' +
                      ' This came from the component with initial state: ' + JSON.stringify( initialState )
            }
        } )
        this.listenPaths = paths.toPaths( initialState )
    }

    /**
     * If you override this, make sure you add a call to super or your state won't work anymore.
     *
     * Once the component is mounted we can get our state hooked up to the providers.
     */
    componentDidMount() {
        this.listenerMutes = this.listenPaths.map(
            path => {
                let updateOn = ( val ) => {
                    paths.putPath( path, this.state, val )
                    this.setState( this.state )
                }
                updateOn.bind( this )

                let localProvided = false
                let mute = this.providers
                           && this.providers
                                  .filter(
                                      provider => provider.canProvide( path )
                                  )
                                  .map(
                                      provider => {
                                          if( localProvided )
                                              throw 'Multiple local providers found for property ' + path + ' property is ambiguous'
                                          localProvided = true
                                          return provider.listen( path, updateOn )
                                      }
                                  )
                if( mute && mute[ 0 ] ) {
                    return mute[ 0 ]
                } else {
                    return null
                }
            }
        )
                                 .filter( mute => !!mute )
    }

    /**
     * Cleanup all of our listeners before we unmount to avoid memory leaks
     * Make sure and call super if you override this or you'll get nasty memory leaks!
     */
    componentWillUnmount() {
        this.listenerMutes.forEach( mute => mute() )
    }
}

/**
 * Create a functional component with a state.
 * @param initialState The initial state of the this component
 * @param providers SharedStateProviders that will provide values for shared state
 * @param render The render method to use when rendering. This is your regular functional component. (props)=>{}
 * @returns {function(*=)} The stateful functional component
 */
export const stateful = ( initialState, providers, render ) => {
    if( !render && typeof providers === 'function' ) {
        render = providers
        providers = []
    }

    class funny extends StatefulComponent {
        constructor( props ) {
            super( initialState, providers, props )
            const applyLocalState = ( ...args ) => this.setState( ...args )
            this.applyLocalState = applyLocalState.bind( this )
        }

        render() {
            return render( Object.assign( {}, this.props, { state: this.state, applyLocalState: this.applyLocalState } ) )
        }
    }

    return ( props ) => React.createElement( funny, Object.assign( {}, props, { key: ( props && props.key ) || uuid() } ) )
}
