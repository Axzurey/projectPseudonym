import {DataStoreService} from '@rbxts/services'

export class user {
    data : GlobalDataStore
    constructor(datastore : string) {
        this.data = DataStoreService.GetDataStore(datastore)
    }
    setAsync(key : string | number, _data : any) {
        key = tostring(key)
        this.data.SetAsync(key, _data)
    }
    getAsync(key : string | number) {
        key = tostring(key)
        return this.data.GetAsync(key)
    }
}