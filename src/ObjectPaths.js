/**
 * Find all paths on the given object up to the specified depth
 * @param next The object to get the paths of
 * @param currPath The currentPath that we're traversing
 * @param paths The array of paths to fill up
 * @param depth How deep we should traverse into the object
 * @param filter A filter to use to avoid traversing properties. i.e. Promises
 */
const toPathStrings = (next, currPath, paths, depth, filter) => {
    if(depth === 0) return
    if (Array.isArray(next) || typeof next !== "object" || !filter(next) ) {
        paths.push(currPath)
    } else {
        Object.keys(next)
            .forEach(k => toPathStrings(next[k], currPath ? currPath + "." + k : k, paths, depth && depth-1, filter))
    }
}

export default {
    /**
     * Convert an object to a list of paths up to the given depth
     * @param obj The object to get the paths of
     * @param filter A filter to use to avoid traversing properties. i.e. Promises
     * @param depth The depth to go
     * @returns {Array} The array of paths
     */
    toPaths: (obj, filter, depth) => {
        const paths = []
        let pass = ()=>true
        toPathStrings(obj, null, paths, depth, filter || pass)
        return paths
    },

    /**
     * Set the value of the given object at the specified path
     * @param path The path to set the value at
     * @param obj The object to set the value on
     * @param val The value to set
     */
    putPath: (path, obj, val) => {
        const parts = path.split(".")
        let current = obj
        for (let i in parts) {
            if (i == parts.length - 1){
                current[parts[i]] = val
            } else if (current[parts[i]]) {
                current = current[parts[i]]
            }
        }
    },

    /**
     * Get the value at the given path from the specified object
     * @param path The path to get
     * @param obj The object to get the value from
     * @returns {{}} The value at the given path
     */
    getPath: (path, obj) => path.split(".").reduce((a, p) => typeof obj[p] !== 'undefined' ? obj[p] : undefined, {})
}