import { useEffect, useState } from "react";
import { blockTable } from "../../data/db";
import { BlockJSON, InlineTJSON, InlineTTypes } from "../../data/block";

//fixme:你不觉得这里全是ts黑魔法吗？
export default function DocumentList(){
    const [documents, setDocuments] = useState<BlockJSON<"doc">[]>([]);
    useEffect(()=>{(async ()=>{
        const res = await blockTable.where("type").equals("doc").toArray();
        setDocuments(res as BlockJSON<"doc">[]);
    })()}, []);
    return(
        <div>
            {documents.map(document=><div key={document.id}>{
                document.p.content.map(inline=>(inline as InlineTJSON<InlineTTypes>).text ?? "").join()
            }</div>)}
        </div>
    );
}