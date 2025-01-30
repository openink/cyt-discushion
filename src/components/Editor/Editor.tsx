import { useEffect } from "react";
import styles from "./Editor.module.css";
import "./css/tiptap.css";
import "./css/editor.css";
import "./css/editor.color.css";
import localforage from "localforage";
import { v4 } from "uuid";
import Toolbar from "../Toolbar/Toolbar";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import BlockID from "./extensions/blockID";
import Blockquote from "./extensions/blockquote";
import BulletList from "./extensions/bulletList";

const lowlight = createLowlight(all);

(window as any).l = localforage;

export default function Editor(){
    const editor = useEditor({
        extensions: [
            Document,
            Text,
            Paragraph.extend({
                renderHTML: ({HTMLAttributes})=>["div", {...HTMLAttributes, class: "dc-p"}, 0]
            }),
            History,
            BlockID,

            //块级元素

            Blockquote,
            BulletList,
            //OrderedList,
            CodeBlockLowlight.configure({lowlight}),
            HardBreak,
            Heading.configure({levels: [1, 2, 3, 4]}),
            HorizontalRule,
            Image,
            TaskItem,
            TaskList,

            //行内元素

            Bold,
            Code,
            Highlight,
            Italic,
            Link,
            Strike,
            Subscript,
            Superscript,
            Underline,
            //这是一个基底扩展，用来做文字颜色
            TextStyle,

        ],
        injectCSS: false,
        onUpdate(props){
            localforage.setItem("content", props.editor.getJSON());
        }
    });
    useEffect(()=>{(async ()=>{
        const iniContent = await localforage.getItem<JSONContent>("content");
        if(iniContent) editor!.commands.setContent(iniContent);
        else editor!.commands.setContent({
            type: "doc",
            content: [{
                type: "paragraph",
                attrs: {id: v4()},
                content: []
            }]
        });
    })()}, []);
    return(
        <EditorContent editor={editor} className={`${styles.outer} dc-container-outer`} />
    );
}