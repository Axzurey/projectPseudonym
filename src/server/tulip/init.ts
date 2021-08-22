import { DataStoreService } from "@rbxts/services";
import { schema } from "./schema"
import { serialize, deserialize } from "./serie"
import { database } from "./db";

export default class main {
    static schema = schema;
    static serialize = serialize;
    static deserialize = deserialize;
    static leaf = database;
}