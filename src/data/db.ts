import Dexie, { EntityTable } from "dexie";
import { BlockJSON, BlockTypes } from "./block";
import { DcConfigs, DcConfigEntry, DcConfigTypes } from "./config";

const db = new Dexie("discushion") as Dexie & {
    blocks :EntityTable<BlockJSON<BlockTypes>, "id">,
    configs :EntityTable<DcConfigEntry<DcConfigTypes>, "key">,
};

db.version(1).stores({
    blocks: "id, type, *children, *parents",
    configs: "key"
});

export default db;