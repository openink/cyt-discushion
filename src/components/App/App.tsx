import Editor from "../Editor/Editor";
import Sidebar from "../Sidebar/Sidebar";
import Debug from "../Debug/Debug";
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { configTable } from "../../data/db";
import { newDocument, UUID } from "../../data/block";
import { Table } from "dexie";
import { DcConfigEntry } from "../../data/config";
import meta from "../../data/meta";
import TicklingCat from "../../sideRequests/TicklingCat/TicklingCat";

export const DocumentIdContext = createContext({
    documentId: "" as UUID,
    setDocumentId: null as unknown as (newId :UUID)=>void | null
})

export default function App(){
    const
    [cursorAnchor, setCursorAnchor] = useState(0),
    [cursorFocus, setCursorFocus] = useState(0),
    [docSize, setDocSize] = useState(0),
    [documentId, setDocumentId] = useState<UUID>("" as UUID),
    setDocumentIdEffect = useCallback((newId :UUID)=>{
        setDocumentId(newId);
        (configTable as Table<DcConfigEntry<"currentDocument">, "currentDocument">).update("currentDocument", {value: newId});
    }, []);
    useEffect(()=>{(async ()=>{
        const currentDocument = await (configTable as Table<DcConfigEntry<"currentDocument">, "currentDocument">).get("currentDocument");
        if(!currentDocument || currentDocument.value === null) setDocumentId(await newDocument());
        //检查文档是否是有效的。目前先不检查了
        //else if()
        else setDocumentId(currentDocument.value);
    })()}, []);
    return(<DocumentIdContext.Provider value={{ documentId, setDocumentId: setDocumentIdEffect }}>
        <TicklingCat />
        {meta.dev ? <Debug cursorAnchor={cursorAnchor} cursorFocus={cursorFocus} docSize={docSize} /> : null}
        <Sidebar />
        <Editor debug={{setCursorAnchor, setDocSize, setCursorFocus}} />
    </DocumentIdContext.Provider>);
}