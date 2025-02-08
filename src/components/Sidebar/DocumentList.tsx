﻿import styles from "./DocumentList.module.css";
import { blockTable } from "../../data/db";
import { useLiveQuery } from "dexie-react-hooks";
import { BlockPJSON, InlineTJSON, InlineTTypes } from "../../data/block";

export default function DocumentList(){
    const documents = useLiveQuery(async ()=>await blockTable.where("type").equals("doc").toArray(), []) as BlockPJSON<"doc">[] | undefined;
    return(<div className={styles.container}>
        {documents ? documents.map(document=><Document key={document.id} data={document} />) : null}
    </div>);
}

function Document({data} :{data :BlockPJSON<"doc">}){
    return(<div className={styles.entry}>
        {data.p.content.map(inline=>(inline as InlineTJSON<InlineTTypes>).text ?? "").join("")}
    </div>);
}