import {SharedStateProvider} from 'index'

let last = 1

class NumbersProvider extends SharedStateProvider {
    loadNumber() {
        this.applySharedState({ numbers: this.state.numbers.concat([last++]) })
    }
    hasNumbers() {
        return this.state.numbers.length > 0
    }
}

export default new NumbersProvider({ numbers: [] })