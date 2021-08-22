import { DataStoreService } from "@rbxts/services";
import { console } from "shared/pkg/quark";
import { schema } from "./schema";

const dsconfig = new Instance("DataStoreOptions")
dsconfig.SetExperimentalFeatures({["v2"]: true})

function getds(name: string) {
    return DataStoreService.GetDataStore(name, undefined, ) as DataStore
}

export class database {
    private name: string
    private schema: schema
    private datastore: DataStore
    constructor(name: string, schema: schema) {
        this.name = name
        this.schema = schema
        this.datastore = getds(name)
    }
    findOne(search: {[key: string]: any}) {
        let keys = this.datastore.ListKeysAsync(undefined, 99)
    }
    testGet() {
        console.log("started operation")
        let t = os.clock()
        for (let i = 0; i < 500; i++) {
            console.log(`getting: ${i}`)
            let x = this.datastore.GetAsync(`@beta.stress.test.${i}`)
        }
        console.log(os.clock() - t)
        console.log("operation complete")
    }
    testCreate() {
        console.log("started operation")
        let testtable: string[][] = new Array(999)
        for (let i=0; i < 999; i++) {
            testtable[i] = ['hello world!']
        }
        console.log("testtable filled")
        let t = os.clock()
        for (let i = 0; i < 500; i++) {
            console.log(`setting: ${i}`)
            this.datastore.SetAsync(`@beta.stress.test.${i}`, testtable)
        }
        console.log(os.clock() - t)
    }
}