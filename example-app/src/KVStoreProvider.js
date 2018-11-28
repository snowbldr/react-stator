import {SharedStateProvider} from 'react-stator'

export default class KVStoreProvider extends SharedStateProvider {

    constructor() {
        super({ store: {
                key: "value",
                hello: "world",
                foo: "bar"
            } })
    }

    put(key, value) {
        this.state.store[key] = value
        this.applySharedState(this.state)
    }

    get(key) {
        return this.state.store[key]
    }

    keys(){
        return Object.keys(this.state.store)
    }
}