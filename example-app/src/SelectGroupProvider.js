import {SharedStateProvider} from 'react-stator'

export default class extends SharedStateProvider {
    constructor(){
        super({selectedId:null})
    }

    select(id){
        this.applySharedState({selectedId: id})
    }

    clearSelection(){
        this.applySharedState({selectedId: null})
    }

    isSelected(id){
        return this.state.selectedId === id
    }
}