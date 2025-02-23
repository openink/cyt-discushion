import styles from "./DocumentList.module.css";
import mainStyles from "../../css/main.module.css";
import { blockTable } from "../../data/db";
import { useLiveQuery } from "dexie-react-hooks";
import { BlockPJSON, InlineTJSON, InlineTTypes } from "../../data/block";
import { useContext } from "react";
import { DocumentIdContext } from "../App/App";
import manulwebp from "./manul.webp";

export default function DocumentList(){
    const documents = useLiveQuery(async ()=>await blockTable.where("type").equals("doc").toArray(), []) as BlockPJSON<"doc">[] | undefined;
    return(<div className={styles.container} style={{
        backgroundImage: `url(${manulwebp})`
    }}>
        {documents ? documents.map(document=><Document key={document.id} data={document} />) : null}
    </div>);
}

function Document({ data } :{ data :BlockPJSON<"doc"> }){
    const { documentId, setDocumentId } = useContext(DocumentIdContext);
    return(<div className={`${styles.entry} ${mainStyles.noselect}${documentId === data.id ? ` ${styles.active}` : ""}`} role="button" onClick={()=>setDocumentId!(data.id!)}>
        {data.p.content.map(inline=>(inline as InlineTJSON<InlineTTypes>).text ?? "").join("")}
    </div>);
}