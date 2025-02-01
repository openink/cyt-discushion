import { mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const BulletList = Node.create({
    name: "bulletlist",
    content: "paragraph block*",
    group: "block list",
    defining: true,
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-ul"},
        {tag: "ul li"},
        {tag: "dc-ul"}
    ],
    //导出的HTML能被再次导入
    renderHTML: ({HTMLAttributes})=>["dc-ul", mergeAttributes(HTMLAttributes)],
    addNodeView: ()=>ReactNodeViewRenderer(BulletListComp),
    addInputRules(){return[wrappingInputRule({
        find: /^-\s$/,
        type: this.type
    })]}
});

export default BulletList;

function BulletListComp(props :NodeViewProps){
    const depth_o3 = props.editor.state.doc.resolve(props.getPos()).depth % 3;
    return(<NodeViewWrapper className="dc-ul">
        <div className="dc-ul-marker-outer"><div className="dc-ul-marker" style={{
            "--ul-marker": `"${depth_o3 ? depth_o3 === 1 ? "◦" : "▪" : "•"}"`
        } as React.CSSProperties} /></div>
        <NodeViewContent className="dc-container-outer" />
    </NodeViewWrapper>);
}