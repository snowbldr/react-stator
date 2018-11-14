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
    if(Array.isArray(next)){
        paths.push(currPath)
        if(next.length > 0) {
            for(let i=0; i<next.length; i++){
                toPathStrings(next[i], `${currPath}[${i}]`, paths, depth && depth-1, filter)
            }
        }
    }  else if (next && typeof next === "object" && filter(next)) {
        Object.keys(next)
            .forEach(k => toPathStrings(next[k], currPath ? currPath + "." + k : k, paths, depth && depth-1, filter))
    } else {
        paths.push(currPath)
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

        if(parts.length === 1){
            obj[parts[0]] = val
        } else {
            const parentPaths = parts.slice(0, parts.length-1)
            const parent = parentPaths
                .reduce((obj, prop)=> {
                    if(!obj[prop]){
                        if(prop.endsWith("]")){
                            obj[prop] = []
                        } else {
                            obj[prop] = {}
                        }
                        return obj[prop]
                    } else {
                        if(prop.endsWith("]")){
                            let indMarker = prop.lastIndexOf("[")
                            let ind = prop.slice(indMarker+1,prop.length-1)
                            let arrProp = prop.slice(0, indMarker);
                            if(!Array.isArray(obj[arrProp])) obj[arrProp] = []
                            return obj[arrProp][parseInt(ind)]
                        } else {
                            return obj[prop]
                        }
                    }
                }, obj)
            if(parent){
                let prop = parts.slice(-1)[0]
                if(prop.endsWith("]")){
                    let indMarker = prop.lastIndexOf("[")
                    let ind = prop.slice(indMarker+1,prop.length-1)
                    parent[prop.slice(0, indMarker)][ind] = val
                } else {
                    parent[prop] = val
                }
            } else {
                return parent
            }
        }
    },

    /**
     * Get the value at the given path from the specified object
     * @param path The path to get
     * @param obj The object to get the value from
     * @returns {{}} The value at the given path
     */
    getPath: (path, obj) => path.split(".").reduce((obj, prop) => {
        if(prop.endsWith("]")){
            let indMarker = prop.lastIndexOf("[")
            let ind = prop.slice(indMarker+1,prop.length-1)
            return obj[prop.slice(0, indMarker)][parseInt(ind)]
        } else {
            return obj[prop] ? obj[prop] : undefined
        }
    }, obj)
}