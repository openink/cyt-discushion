import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { configTable } from "../../data/db";
import DocumentList from "./DocumentList";
import TopMenu from "./menu/TopMenu";
import BottomMenu from "./menu/BottomMenu";

const defaultWidth = 200;

export default function Sidebar(){
    const [width, setWidth] = useState(defaultWidth);
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
            <TopMenu />
            <DocumentList />
            <BottomMenu />
        </div>
        <div className={styles.resizerOuter}><div className={styles.resizer} /></div>
    </div>);
}