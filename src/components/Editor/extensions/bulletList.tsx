import { mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const BulletList = Node.create({
    //为了避开Tiptap对ul和ol的特殊处理，不写 `bulletList`。
    //https://github.com/ueberdosis/tiptap/blob/b7a7b2ad85cce18449bf856fac8a8b6a301f502c/packages/core/src/inputRules/wrappingInputRule.ts#L68
    name: "bulletlist",
    content: "paragraph block*",
    group: "block",
    defining: true,
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-ul"},
        {tag: "ul li"},
        {tag: "dc-ul"}
    ],
    //导出的HTML能被再次导入
    renderHTML: ({HTMLAttributes})=>["dc-ul", HTMLAttributes, 0],
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