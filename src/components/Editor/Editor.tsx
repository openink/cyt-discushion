import styles from "./Editor.module.css";
import "./css/editor.css";
import "./css/editor.color.css";
import "./css/trailingbreak.css";

import { configTable } from "../../data/db";
import { getDocument, UUID } from "../../data/block";
import PopupMenu from "./PopupMenu";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";

import History from "@tiptap/extension-history";
import BlockID from "./extensions/technical/blockID";
import NoUndoSetIniContent from "./extensions/technical/noUndoSetIniContent";
import ClearMarks from "./extensions/technical/clearMarks";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";

import Document from "@tiptap/extension-document";
import Paragraph from "./extensions/block/paragraph";
import Blockquote from "./extensions/block/blockquote";
import BulletList from "./extensions/block/bulletList";
import OrderedList from "./extensions/block/orderedList";
import Heading from "@tiptap/extension-heading";

import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";

//import { Bold } from "@tiptap/extension-bold";
//import { Italic } from "@tiptap/extension-italic";
import Bold from "./extensions/mark/bold";
import Italic from "./extensions/mark/italic";
import Underline from "./extensions/mark/underline";
import Strike from "./extensions/mark/strike";
import Code from "./extensions/mark/code";
import { all, createLowlight } from "lowlight";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import BubbleMenu from "@tiptap/extension-bubble-menu";

const lowlight = createLowlight(all);

export default function Editor(){
    const editor = useEditor({
        extensions: [
            //技术性扩展
            History, BlockID, NoUndoSetIniContent, ClearMarks,
            BubbleMenu.configure({
                updateDelay: 250,
                tippyOptions: {
                    duration: 100,
                    interactive: true
                }
            }),
            Dropcursor.configure({
                class: "dc-dropcursor",
                color: "red",
                width: 2
            }),
            Placeholder.configure({
                emptyEditorClass: "dc-editor-empty",
                emptyNodeClass: "dc-empty",
                placeholder: ""
            }),
            //块级节点
            Document, Paragraph, Blockquote, BulletList, OrderedList, Heading.configure({levels: [1, 2, 3, 4]}),
            //行内节点
            Text, HardBreak,
            //标记节点
            Bold, Italic, Underline, Strike, Code, Link.configure({
                protocols: ["http", "https", "mailto", "ftp"],
                openOnClick: true,
                linkOnPaste: false
            }),
            //未处理
            Highlight, Superscript, Subscript,
            CodeBlockLowlight.configure({lowlight}),
            HorizontalRule,
            Image,
            //这是一个基底扩展，用来做文字颜色
            TextStyle,
        ],
        injectCSS: false,
        onUpdate(props){
            console.log(props);
        }
    });
    useEffect(()=>{(async ()=>{
        const
        currentDocumentA = await configTable.get("currentDocument"),
        iniContent = await getDocument(currentDocumentA ? currentDocumentA.value as UUID | null : currentDocumentA);
        editor!.commands.setIniContent(iniContent);
    })()}, []);
    return(<>
        <EditorContent editor={editor} className={`${styles.outer} dc-container-outer`} />
        {editor ? <PopupMenu editor={editor} /> : null}
    </>);
}