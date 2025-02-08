import Dexie, { EntityTable } from "dexie";
import { BlockJSON, BlockTypes, UUID } from "./block";
import { DcConfigEntry, DcConfigTypes } from "./config";

export const db = new Dexie("discushion") as Dexie & {
    blocks :EntityTable<BlockJSON<BlockTypes>, "id">,
    configs :EntityTable<DcConfigEntry<DcConfigTypes>, "key">,
};

db.version(1).stores({
    blocks: "id, type, *children",
    //blocks: "id, type, *children, *parents",
    configs: "key"
});

export const blockTable = db.table<BlockJSON<BlockTypes>, UUID>("blocks");
export const configTable = db.table<DcConfigEntry<DcConfigTypes>, DcConfigTypes>("configs");