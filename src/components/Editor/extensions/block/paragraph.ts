import { mergeAttributes } from "@tiptap/core";
import _Paragraph from "@tiptap/extension-paragraph";

const Paragraph = _Paragraph.extend({
    //draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-p"},
        {tag: "div"},
        {tag: "p"}
    ],
    renderHTML: ({HTMLAttributes})=>["div", mergeAttributes(HTMLAttributes, {class: "dc-p"}), 0]
});

export default Paragraph;