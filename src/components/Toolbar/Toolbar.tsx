import { useMemo, useState } from "react";
import styles from "./Toolbar.module.css";
import { useChainedCommands, useCommands, useEditorEvent, useRemirrorContext } from "@remirror/react";
import { Extension, RemirrorEventListenerProps } from "remirror";
import { getPx } from "../../utils/css";

type Pos = {
    top :number;
    left :number;
};

let shouldShow = false;

export default function Toolbar(){
    const
        [pos, setPos] = useState<Pos>({top: 0, left: 0}),
        [show, setShow] = useState(false),
        chain = useChainedCommands(),
        commands = useCommands(),
        _2rem = useMemo(()=>getPx("2rem"), []),
        selectionCB = (data :RemirrorEventListenerProps<Extension>)=>{
            //console.log(data.state.selection, data.state.selection.empty);
            if(!data.state.selection.empty){
                if(!show){
                    const rect = window.getSelection()!.getRangeAt(0).getBoundingClientRect();
                    //console.log(rect);
                    setPos({
                        top: (rect?.top ?? 0) - _2rem,
                        left: rect?.left ?? 0
                    });
                    shouldShow = true;
                }
            }
            else{
                shouldShow = false;
                setShow(false);
            }
        },
        editor = useRemirrorContext(selectionCB),
        mouseUpCB = (event :MouseEvent)=>setShow(shouldShow);
    useEditorEvent("mouseup", mouseUpCB);
    return(<div className={styles.outer} style={{
        top: pos.top,
        left: pos.left,
        display: show ? "flex" : "none"
    }}>
        <button className={styles.button} disabled={!commands.toggleBold.enabled()} onClick={()=>chain.toggleBold().focus().run()}>B</button>
        <button className={styles.button} disabled={!commands.toggleItalic.enabled()} onClick={()=>chain.toggleItalic().focus().run()}>I</button>
        <button className={styles.button} disabled={!commands.toggleUnderline.enabled()} onClick={()=>chain.toggleUnderline().focus().run()}>U</button>
        <button className={styles.button} disabled={!commands.toggleStrike.enabled()} onClick={()=>chain.toggleStrike().focus().run()}>S</button>
    </div>);
}