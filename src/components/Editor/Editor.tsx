import { useEffect } from "react";
import styles from "./Editor.module.css";
import "./tiptap.css";
import "./editor.css";
import "./editor.color.css";
import localforage from "localforage";
import Toolbar from "../Toolbar/Toolbar";
import { v4 } from "uuid";
import { EditorContent, Extension, JSONContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";
import Blockquote from "@tiptap/extension-blockquote";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
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


function findFGColor(element :HTMLElement) :string | null{
    for(let i = 0; i < element.classList.length; i++) if(element.classList[i].match(/^dc-fc-*$/)) return element.classList[i].replace("dc-fc-", "");
    return null;
}

function findBGColor(element :HTMLElement) :string | null{
    for(let i = 0; i < element.classList.length; i++) if(element.classList[i].match(/^dc-bc-*$/)) return element.classList[i].replace("dc-bc-", "");
    return null;
}

const
lowlight = createLowlight(all),
BlockID = Extension.create({
    addGlobalAttributes(){return[{
        types: ["paragraph", "blockquote", "bulletList", "orderedList", "heading", "horizontalRule", "image", "taskItem"],
        attributes: {
            id: {
                default: null,
                isRequired: true,
                keepOnSplit: false,
                parseHTML: element=>element.getAttribute("data-block-id"),
                renderHTML: attrs=>({"data-block-id": attrs.id})
            }
        }
    }]},
    addKeyboardShortcuts(){return{
        Enter: ({editor})=>{
            if(editor.state.selection.$from.node().textContent === "" && editor.state.selection.$from.depth > 1){
                console.log("534");
                return true;
            }
            else return this.editor.chain().splitBlock().updateAttributes(editor.state.selection.$from.node().type.name, {id: v4()}).run();
        }
    }}
});

export default function Editor(){
    const editor = useEditor({
        extensions: [
            Document,
            Text,
            Paragraph.extend({
                renderHTML: ({HTMLAttributes})=>["div", {...HTMLAttributes, class: "dc-paragraph"}, 0]
            }),
            History,
            BlockID,

            //块级元素

            Blockquote.extend({
                addAttributes(){return{
                    color: {
                        default: null,
                        isRequired: true,
                        parseHTML: element=>findFGColor(element),
                        renderHTML: attrs=>({class: attrs.color})
                    }
                }}
            }),
            ListItem,
            BulletList,
            OrderedList,
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
        if(iniContent) editor?.commands.setContent(iniContent);
    })()}, []);
    return(<div className={styles.outer}>
        <EditorContent editor={editor} />
    </div>);
}

(window as any).l = localforage;

function ViewInner(){

    return null;
}