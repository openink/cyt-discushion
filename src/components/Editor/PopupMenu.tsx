import { getPx } from "../../utils/css";
import styles from "./PopupMenu.module.css";
import gStyles from "../../css/main.module.css";
import { BubbleMenu, Editor } from "@tiptap/react";

interface Props{
    editor :Editor;
}

export default function PopupMenu(props :Props){
    const {editor} = props;
    return(<BubbleMenu className={`${styles.outer} ${gStyles.noselect}`} editor={editor} tippyOptions={{
        duration: 100,
        interactive: true
    }}>
        {editor.state.selection.$anchor.parent === editor.state.selection.$head.parent ? <BlockTypeSelecter editor={editor} /> : null}
        <button
            className={`${styles.markButton}${editor.isActive("bold") ? ` ${styles.active}` : ""}`}
            onClick={()=>{console.log("6");editor.chain().focus().toggleBold().run()}}
            disabled={!editor.can().toggleBold()}
            style={{fontWeight: "bold"}}
        ><b>B</b></button>
        <button
            className={`${styles.markButton}${editor.isActive("italic") ? ` ${styles.active}` : ""}`}
            onClick={()=>{editor.chain().focus().toggleItalic().run()}}
            disabled={!editor.can().toggleItalic()}
        ><i>I</i></button>
        <button
            className={`${styles.markButton}${editor.isActive("underline") ? ` ${styles.active}` : ""}`}
            onClick={()=>{editor.chain().focus().toggleUnderline().run()}}
            disabled={!editor.can().toggleUnderline()}
        ><u>U</u></button>
        <button
            className={`${styles.markButton}${editor.isActive("strike") ? ` ${styles.active}` : ""}`}
            onClick={()=>{editor.chain().focus().toggleStrike().run()}}
            disabled={!editor.can().toggleStrike()}
        ><s>S</s></button>
    </BubbleMenu>);
}

function BlockTypeSelecter(props :Props){
    const _1rem = getPx("1rem");
    return(<button className={styles.selectButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width={_1rem} height={_1rem} viewBox="0 0 24 24"><path fill="none" stroke="var(--c-grey-5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m7 10l5 5m0 0l5-5" /></svg>
        {props.editor.state.selection.$anchor.parent.type.name}
    </button>);
}