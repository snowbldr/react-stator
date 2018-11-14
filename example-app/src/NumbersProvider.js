import {SharedStateProvider} from 'react-stator'

export default class NumbersProvider extends SharedStateProvider {

    constructor() {
        super({ numbers: Promise.resolve([]) })
        this.last = 1
    }

    loadNumber() {
        this.applySharedState({numbers: this.state.numbers.concat([this.last++])})
    }

    hasNumbers() {
        return this.state.numbers && this.state.numbers.length > 0
    }
}