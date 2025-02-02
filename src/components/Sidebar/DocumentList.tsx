import { useEffect, useState } from "react";
import styles from "./DocumentList.module.css";
import { blockTable } from "../../data/db";
import { BlockJSON, BlockPJSON, InlineTJSON, InlineTTypes } from "../../data/block";

//fixme:你不觉得这里全是ts黑魔法吗？
export default function DocumentList(){
    const [documents, setDocuments] = useState<BlockJSON<"doc">[]>([]);
    useEffect(()=>{(async ()=>{
        const res = await blockTable.where("type").equals("doc").toArray();
        setDocuments(res as BlockJSON<"doc">[]);
    })()}, []);
    return(<div className={styles.container}>
        {documents.map(document=><Document key={document.id} data={document} />)}
    </div>);
}

function Document(props :{data :BlockPJSON<"doc">}){
    const {data} = props;
    return(<div className={styles.entry}>
        {data.p.content.map(inline=>(inline as InlineTJSON<InlineTTypes>).text ?? "").join()}
    </div>);
}