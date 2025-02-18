import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import "./resize.css";
import DocumentList from "./DocumentList";
import TopMenu from "./menu/TopMenu";
import BottomMenu from "./menu/BottomMenu";
import Resizer from "./Resizer";
import { configTable } from "../../data/db";
import { Table } from "dexie";
import { DcConfigEntry } from "../../data/config";
import { getPx } from "../../utils/css";
import Manul from "../../sideRequests/Manul/Manul";

export const defaultSidebarWidth = 200;

/**@once*/
export default function Sidebar(){
    const
    [width, setWidth] = useState(defaultSidebarWidth);
    useEffect(()=>{(async ()=>{
        const
        widthKV = await (configTable as Table<DcConfigEntry<"sidebarWidth">, "sidebarWidth">).get("sidebarWidth"),
        _50vw = getPx("50vw"),
        _5rem = getPx("5rem");
        let width :number = 0;
        if(!widthKV || !widthKV.value){
            configTable.add({key: "sidebarWidth", value: defaultSidebarWidth});
            width = defaultSidebarWidth;
        }
        else width = widthKV.value;
        if(width > _50vw){
            configTable.put({key: "sidebarWidth", value: _50vw});
            width = _50vw;
        }
        if(width < _5rem){
            configTable.put({key: "sidebarWidth", value: _5rem});
            width = _5rem;
        }
        setWidth(width);
    })()}, []);
    return(<div className={styles.outer} style={{width}}>
        <div className={styles.inner}>
            <TopMenu />
            <DocumentList />
            <Manul scale={0.2} />
            <BottomMenu />
        </div>
        <Resizer setWidth={setWidth} />
    </div>);
}