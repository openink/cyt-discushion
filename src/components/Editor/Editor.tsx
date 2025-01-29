import { useCallback, useEffect, useState } from "react";
import styles from "./Editor.module.css";
import localforage from "localforage";
import Toolbar from "../Toolbar/Toolbar";
import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { v4 } from "uuid";

export default function Editor(){
    const editor = useEditor({
        extensions: [
            Document,
            Text,
            Paragraph.extend({
                addAttributes: ()=>({
                    id: {
                        default: null,
                        keepOnSplit: false,
                        parseHTML: element=>element.getAttribute("data-block-id"),
                        isRequired: true,
                        renderHTML: attrs=>({"data-block-id": attrs.id})
                    }
                }),
                renderHTML: (props)=>["div", {...props.HTMLAttributes, class: "dc-paragraph"}, 0],
                addKeyboardShortcuts(){return{
                    Enter: ()=>this.editor.chain().splitBlock().updateAttributes("paragraph", {id: v4()}).run()
                }}
            })
        ],
        content: "<div>Hello world!</div>",
        autofocus: "start"
    });
    return(<div className={styles.outer}>
        <EditorContent editor={editor} />
    </div>);
}

function ViewInner(){

    return null;
}