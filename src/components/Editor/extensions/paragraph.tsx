import { Paragraph as _Paragraph } from "@tiptap/extension-paragraph";
import { mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const Paragraph = _Paragraph.extend({
    renderHTML: ({HTMLAttributes})=>["div", {...HTMLAttributes, class: "dc-p"}, 0]
});
export default Paragraph;

function ParagraphComp(){
    return(<NodeViewWrapper>
        
    </NodeViewWrapper>);
}