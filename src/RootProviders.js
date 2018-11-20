/**
 * The root providers keyed by the property paths they provide
 * @type {{}}
 */
import ObjectPaths from './ObjectPaths'

const rootProviders = {}

/**
 * Register a new root provider. No duplicate property paths are allowed between all root providers, as that would
 * make the actual provider ambiguous
 * @param provider The provider to register
 */
export const registerRootProvider = ( provider ) => {
    if( !provider.initialPaths ) {
        throw 'The object you tried to register as a root provider doesn\'t look like a SharedStateProvider. ' +
              'Make sure you instantiated the object and that you called super in your classes constructor'
    }
    Object.keys( provider.initialPaths ).forEach(
        ( path ) => {
            if( rootProviders[ path ] ) {
                throw 'Duplicate path found for the given root providers. Path is: ' + path
            } else {
                rootProviders[ path ] = provider
            }
        } )
}

/**
 * Get a the root providers. Add providers using registerRootProvider
 * You can modify this object directly, but it will probably break, or just do nothing.
 * @returns {{}}
 */
export const getRootProviders = () => rootProviders

/**
 * Get the provider for the state that you're using
 * @param stateProvided A path like "can.put[0]" of a provided state or an object that looks like your state, like
 *          {
 *              "You":"really",
 *              "can": {
 *                  "put":["stuff","any","where"],
 *                  "that": {
 *                      "...": Promise.resolve("you want")
 *                  }
 *              }
 *          }
 * @returns {T | {}}
 */
export const providerOf = ( stateProvided ) => {
    if( typeof stateProvided === 'string' ) {
        return rootProviders[ stateProvided ]
    } else {
        let paths = ObjectPaths.toPaths( stateProvided, ( obj ) => !( obj && typeof obj.then === 'function' ) )
        if( paths < 1 ) {
            throw 'You must supply at least one property to get the provider for. ' +
                  'They will be returned with the same shape as the object provided'
        }
        return paths.reduce( ( res, path ) => {
            ObjectPaths.putPath( path, res, rootProviders[ path ] )
            return res
        }, {} )
    }
}

export default { registerRootProvider, getRootProviders, providerOf }