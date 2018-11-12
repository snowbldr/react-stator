import paths from './ObjectPaths'
import uuid from 'uuid/v4'

export default class SharedStateProvider {
    constructor(provides) {
        this.initialPaths = paths.toPaths(provides, 1)
        this.state = Object.assign({}, provides)
        this.listeners = {}
        this.isLoaded = false
        const applySharedState = (newState) => this.initialPaths.forEach(p => {
            let value = paths.getPath(p, newState)
            if (value) {
                paths.putPath(p, this.state, value)
                this.notify(p, value)
            }
        })

        this.applySharedState = applySharedState.bind(this)
    }

    listen(path, listener) {
        this.load()
        if (!this.listeners[path]) this.listeners[path] = {}
        let listenerKey = uuid()
        this.listeners[path][listenerKey] = listener
        let currentValue = paths.getPath(path, this.state)
        if (currentValue) listener(currentValue)
        return listenerKey
    }

    mute(path, listenerKey) {
        if (this.listeners[path]) delete this.listeners[path][listenerKey]
    }

    canProvide(path) {
        return this.initialPaths.some(initialPath => path.startsWith(initialPath))
    }

    notify(path, value) {
        this.listeners[path] && Object.keys(this.listeners[path]).forEach(listener => {
            this.listeners[path][listener](value)
        })
    }

    load() {
        if (!this.isLoaded) {
            this.isLoaded = true
            for (let p of this.initialPaths) {
                let value = paths.getPath(p, this.state)
                let setState = (val)=>{
                    paths.putPath(p, this.state, val)
                    this.notify(p, val)
                }
                setState.bind(this)
                if (typeof value.then === 'function') {
                    value.then(setState)
                } else {
                    setState(value)
                }

            }
        }
    }
}