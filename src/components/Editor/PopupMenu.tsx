import styles from "./PopupMenu.module.css";
import { BubbleMenu, Editor } from "@tiptap/react";

interface Props{
    editor :Editor;
}

export default function PopupMenu(props :Props){
    const {editor} = props;
    return(<BubbleMenu className={styles.outer} editor={editor} tippyOptions={{
        duration: 100
    }}>
        {editor.state.selection.$anchor.parent === editor.state.selection.$head.parent ? <BlockSelect editor={editor} /> : null}
        <button className={styles.markButton}
            onClick={()=>{editor.chain().focus().toggleBold().run()}}
            disabled={editor ? false : true}
        >B</button>
        <button>
            I
        </button>
    </BubbleMenu>);
}

function BlockSelect(props :Props){
    return(<button className={styles.selectButton}>
        {props.editor.state.selection.$anchor.parent.type.name}
    </button>);
}