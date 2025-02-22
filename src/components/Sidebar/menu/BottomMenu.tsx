import styles from "./Menu.module.css";
import bStyles from "./BottomMenu.module.css";
import { useContext } from "react";
import { DocumentIdContext } from "../../App/App";
import { newDocument } from "../../../data/block";

export default function BottomMenu(){
    const
    { documentId, setDocumentId } = useContext(DocumentIdContext),
    createDocument = async ()=>{
        const uuid = await newDocument();
        setDocumentId!(uuid);
    };
    return(<div className={`${styles.outer} ${bStyles.outer}`}>
        <button className={styles.button} onClick={createDocument}>新建</button>
        <button className={styles.button}>回收站</button>
    </div>);
}