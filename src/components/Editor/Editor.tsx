﻿import styles from "./Editor.module.css";
import "./css/editor.css";
import "./css/editor.color.css";
import "./css/trailingbreak.css";

import { getDocument, UUID } from "../../data/block";
import PopupMenu from "./PopupMenu";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
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
import AppendParagraph from "./extensions/technical/appendParagraph";
import NoSelectTB from "./extensions/technical/noSelectTB";
import Garagraph from "./extensions/block/garagraph";

type Props = {
    documentId :UUID;
    debug :{
        setCursorAnchor :Dispatch<SetStateAction<number>>;
        setDocSize :Dispatch<SetStateAction<number>>;
        setCursorFocus :Dispatch<SetStateAction<number>>;
    }
};

const lowlight = createLowlight(all);

export default function Editor({documentId, debug} :Props){
    const
    editor = useEditor({
        extensions: [
            //技术性扩展
            History, BlockID, NoUndoSetIniContent, ClearMarks, AppendParagraph, NoSelectTB,
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
            //Document没有渲染结果，是一个虚拟块，没必要自己开发
            //Garagraph是能够内嵌其他段落的paragraph
            Document, Paragraph, Garagraph, Blockquote, BulletList, OrderedList, Heading.configure({levels: [1, 2, 3, 4]}),
            CodeBlockLowlight.configure({lowlight}),
            //行内节点
            Text, HardBreak,
            //标记节点
            Bold, Italic, Underline, Strike, Code, Link.configure({
                //这个之后肯定要改/自己从头写，里面太多不能配置的东西了
                protocols: ["http", "https", "mailto", "ftp"],
                openOnClick: true,
                linkOnPaste: false,
                autolink: false
            }),
            //未处理
            Highlight, Superscript, Subscript,
            HorizontalRule,
            Image,
            //这是一个基底扩展，用来做文字颜色
            TextStyle,
        ],
        injectCSS: false,
        //这里仅供debug使用
        //其他逻辑请使用插件添加
        onSelectionUpdate(props){
            debug.setCursorAnchor(props.editor.state.selection.anchor);
            debug.setCursorFocus(props.editor.state.selection.head);
        },
        onUpdate(props){
            //不是props.editor.state.doc.nodeSize！https://prosemirror.net/docs/guide/#doc:~:text=Note%20that%20for%20the%20outer%20document%20node%2C%20the%20open%20and%20close%20tokens%20are%20not%20considered%20part%20of%20the%20document%20(because%20you%20can%27t%20put%20your%20cursor%20outside%20of%20the%20document)%2C%20so%20the%20size%20of%20a%20document%20is%20doc.content.size%2C%20not%20doc.nodeSize.
            debug.setDocSize(props.editor.state.doc.content.size);
        }
    }),
    editorOuter = useRef<HTMLDivElement>(null),
    clickCB = useCallback((event :React.MouseEvent<HTMLDivElement>)=>{
        //console.log(editor!.state.selection.$anchor);
        if(
            event.target === editorOuter.current?.childNodes[0]
         && editor!.state.selection.$anchor.parent.content.size !== 0
         && editor!.state.selection.empty
        ) editor!.commands.appendParagraph();
    }, []);
    useEffect(()=>{(async ()=>{
        const iniContent = await getDocument(documentId);
        //console.log(iniContent);
        editor!.commands.setIniContent(iniContent);
    })()}, [documentId]);
    return(<>
        <EditorContent editor={editor} className={`${styles.outer} dc-container-outer`} ref={editorOuter} onClick={clickCB} />
        {editor ? <PopupMenu editor={editor} /> : null}
    </>);
}