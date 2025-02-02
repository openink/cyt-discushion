import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { configTable } from "../../data/db";
import Menu from "../Menu/Menu";
import DocumentList from "../DocumentList/DocumentList";

const defaultWidth = 200;

export default function Sidebar(){
    const [width, setWidth] = useState(0);
    useEffect(()=>{(async ()=>{
        const widthKV = await configTable.get("sidebarWidth");
        if(!widthKV || !widthKV.value){
            configTable.add({key: "sidebarWidth", value: defaultWidth});
            setWidth(defaultWidth);
        }
        //fixme:更合理的类型推断
        else setWidth(widthKV.value as number);
    })()}, []);
    return(<div className={styles.outer} style={{width}}>
        <div className={styles.inner}>
            <Menu />
            <DocumentList />
        </div>
        <div className={styles.resizerOuter}><div className={styles.resizer} /></div>
    </div>);
}