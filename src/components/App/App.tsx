import Editor from "../Editor/Editor";
import Sidebar from "../Sidebar/Sidebar";
import Debug from "../Debug/Debug";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { configTable } from "../../data/db";
import { newDocument, UUID } from "../../data/block";
import { Table } from "dexie";
import { DcConfigEntry } from "../../data/config";
import meta from "../../data/meta";
import TicklingCat from "../../sideRequests/TicklingCat/TicklingCat";

export const DocumentIdContext = createContext({
    documentId: "" as UUID,
    setDocumentId: null as Dispatch<SetStateAction<UUID>> | null
})

export default function App(){
    const
    [cursorAnchor, setCursorAnchor] = useState(0),
    [cursorFocus, setCursorFocus] = useState(0),
    [docSize, setDocSize] = useState(0),
    [documentId, setDocumentId] = useState<UUID>("" as UUID);
    useEffect(()=>{(async ()=>{
        const currentDocument = await (configTable as Table<DcConfigEntry<"currentDocument">, "currentDocument">).get("currentDocument");
        if(!currentDocument || currentDocument.value === null) setDocumentId(await newDocument());
        //检查文档是否是有效的。目前先不检查了
        //else if()
        else setDocumentId(currentDocument.value);
    })()}, []);
    return(<DocumentIdContext.Provider value={{ documentId, setDocumentId }}>
        <TicklingCat />
        {meta.dev ? <Debug cursorAnchor={cursorAnchor} cursorFocus={cursorFocus} docSize={docSize} /> : null}
        <Sidebar />
        <Editor debug={{setCursorAnchor, setDocSize, setCursorFocus}} />
    </DocumentIdContext.Provider>);
}