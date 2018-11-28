import paths from './ObjectPaths'
import uuid from 'uuid/v4'

/**
 * A SharedStatProvider provides the values of a shared state to the listening components.
 */
export default class SharedStateProvider {
    /**
     * The state this provider provides. This is also the initial state for this provider.
     * If any values on the initial state have a "then" function, we will assume it's a promise,
     * execute the promise, and update the initial state to the resolved value.
     * @param provides The initial state
     */
    constructor( provides ) {
        this.initialPaths = paths.toPaths( provides,
                                           ( obj ) => !( obj && typeof obj.then === 'function' ) )
                                 .reduce(
                                     ( paths, path ) => {
                                         paths[ path ] = true
                                         return paths
                                     }, {} )
        this.state = Object.assign( {}, provides )
        this.listeners = {}
        this.load()

        /**
         * This works Object.assign from the old state to the new state
         * @param newState
         */
        const applySharedState = ( newState ) => {
            Object.keys( this.initialPaths ).forEach( p => {
                if(paths.hasPath(p, newState)){
                    let value = paths.getPath( p, newState )
                    if( value && typeof value.then === 'function' ) {
                        const doUpdate = ( val ) => {
                            paths.putPath( p, this.state, value )
                            this.notify( p, val )
                        }
                        value.then( doUpdate.bind( this ) )
                    } else {
                        paths.putPath( p, this.state, value )
                        this.notify( p, value )
                    }
                }
            } )
        }

        this.applySharedState = applySharedState.bind( this )
    }

    /**
     * Listen for changes to the specified path
     * @param path The path to listen to changes for
     * @param listener A function that will be executed to inform the caller of the new value. (newValue)=>{}
     * @returns {*} A function to call to stop listening for changes
     */
    listen( path, listener ) {
        if( !this.listeners[ path ] ) this.listeners[ path ] = {}
        let listenerKey = uuid()
        this.listeners[ path ][ listenerKey ] = listener
        let currentValue = paths.getPath( path, this.state )
        if( currentValue ) listener( currentValue )
        let mute = () => {
            if( this.listeners[ path ] ) delete this.listeners[ path ][ listenerKey ]
        }
        mute.bind( this )
        return mute
    }

    /**
     * Determine if this provider can provide the given state path
     */
    canProvide( path ) {
        return !!this.initialPaths[ path ]
    }

    /**
     * Notify the listeners of a new value at the given path
     */
    notify( path, value ) {
        this.listeners[ path ] && Object.keys( this.listeners[ path ] ).forEach( listener => {
            this.listeners[ path ][ listener ]( value )
        } )
    }

    /**
     * Load any state promises and notify the listeners
     */
    load() {
        for( let p in this.initialPaths ) {
            let value = paths.getPath( p, this.state )
            let setState = ( val ) => {
                paths.putPath( p, this.state, val )
                this.notify( p, val )
            }
            setState.bind( this )
            if( value && typeof value.then === 'function' ) {
                paths.putPath( p, this.state, null )
                value.then( setState )
            } else {
                setState( value )
            }
        }
    }
}