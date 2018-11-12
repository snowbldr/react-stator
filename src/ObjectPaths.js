const toPathStrings = (next, currPath, paths, depth) => {
    if(depth=0) return
    if (Array.isArray(next) || typeof next !== "object") {
        paths.push(currPath)
    } else {
        Object.keys(next)
            .forEach(k => toPathStrings(next[k], currPath ? currPath + "." + k : k, paths, depth-1))
    }
}

export default {
    toPaths: (attrs, depth) => {
        const paths = []
        toPathStrings(attrs, null, paths, depth)
        return paths
    },

    putPath: (path, root, val) => {
        const parts = path.split(".")
        let current = root
        for (let i in parts) {
            if (i == parts.length - 1){
                current[parts[i]] = val
            } else if (current[parts[i]]) {
                current = current[parts[i]]
            }
        }
    },

    getPath: (path, obj) => path.split(".").reduce((a, p) => typeof obj[p] !== 'undefined' ? obj[p] : undefined, {})
}