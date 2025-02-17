import styles from "./Editor.module.css";
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
import TrailingP from "./extensions/technical/trailingP";
import PmtbFix from "./extensions/technical/pmtbFix";
import Copy from "./extensions/technical/copy";
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
            History, BlockID, NoUndoSetIniContent, ClearMarks, TrailingP, PmtbFix, Copy,
            BubbleMenu.configure({
                updateDelay: 250,
                tippyOptions: {
                    duration: 100,
                    interactive: true
                }
            }),
            Dropcursor.configure({
                class: "dc-dropcursor",
                color: "var(--c-drop-cursor)",
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
    //自动新增末尾段落（trailing paragraph）
    editorOuter = useRef<HTMLDivElement>(null),
    clickCB = useCallback((event :React.MouseEvent<HTMLDivElement>)=>{
        const {state, commands} = editor!, anchor = state.selection.$anchor, {parent} = anchor;
        if(
            //点击发生在最外层包装div，不是在节点里
            event.target === editorOuter.current?.childNodes[0]
            //选区为空
         && state.selection.empty
            //选区所在区块是最后一个区块。由于进入/离开doc不算1单位，所以多算了这部分，要减去1单位
         && parent.nodeSize + anchor.start(anchor.depth) - 1 === state.doc.content.size
            //选区所在区块不为空
         && parent.content.size !== 0
        ){
            //防止用户撤销这一步，让光标跑回到上一区块的（浏览器计算出来的位置）中间
            commands.setSelectionToEnd();
            commands.appendParagraph();
        }
    }, []);
    //获取初始内容（防止了用户撤销回到全空文档）
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