﻿import { mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const Blockquote = Node.create({
    name: "blockquote",
    content: "paragraph block*",
    group: "block container",
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-bq"},
        {tag: "blockquote"},
        {tag: "dc-bq"}
    ],
    //导出的HTML能被再次导入
    renderHTML: ({HTMLAttributes})=>["dc-bq", HTMLAttributes, 0],
    addNodeView: ()=>ReactNodeViewRenderer(BlockquoteComp),
    addInputRules(){return[wrappingInputRule({
        find: /^>\s$/,
        type: this.type
    })]}
});

export default Blockquote;

function BlockquoteComp(props :NodeViewProps){
    return(<NodeViewWrapper className="dc-bq" style={{
        borderLeftColor: "#000"
    }}>
        <NodeViewContent className="dc-container-outer" />
    </NodeViewWrapper>);
}