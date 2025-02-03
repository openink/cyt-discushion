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
import BlockID from "./extensions/blockID";
import NoUndoSetIniContent from "./extensions/noUndoSetIniContent";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";

import Document from "@tiptap/extension-document";
import Paragraph from "./extensions/paragraph";
import Blockquote from "./extensions/blockquote";
import BulletList from "./extensions/bulletList";
import OrderedList from "./extensions/orderedList";
import Heading from "@tiptap/extension-heading";

import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { all, createLowlight } from "lowlight";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

const lowlight = createLowlight(all);

export default function Editor(){
    const editor = useEditor({
        extensions: [
            //技术性元素
            History, BlockID, NoUndoSetIniContent,
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
            //块级元素
            Document, Paragraph, Blockquote, BulletList, OrderedList, Heading.configure({levels: [1, 2, 3, 4]}),
            //行内元素
            Text, HardBreak,
            //标记元素
            Bold, Italic, Underline, Strike, Code, Link, Highlight, Superscript, Subscript,
            //
            CodeBlockLowlight.configure({lowlight}),
            HorizontalRule,
            Image,
            //TaskItem,
            //TaskList,
            
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
        console.log(iniContent);
        editor!.commands.setContent(iniContent, false);
    })()}, []);
    return(<>
        <EditorContent editor={editor} className={`${styles.outer} dc-container-outer`} />
        {editor ? <PopupMenu editor={editor} /> : null}
    </>);
}