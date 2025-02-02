import { Paragraph as _Paragraph } from "@tiptap/extension-paragraph";

const Paragraph = _Paragraph.extend({
    renderHTML: ({HTMLAttributes})=>["div", {...HTMLAttributes, class: "dc-p"}, 0]
});
export default Paragraph;