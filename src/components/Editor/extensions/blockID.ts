import { Extension } from "@tiptap/react";

const BlockID = Extension.create({
    addGlobalAttributes(){return[{
        //不能再嵌套块级元素的元素才需要block-id
        types: ["paragraph", "heading", "horizontalRule", "image", "taskItem"],
        attributes: {
            id: {
                default: null,
                isRequired: true,
                keepOnSplit: false,
                parseHTML: element=>element.getAttribute("data-block-id"),
                renderHTML: attrs=>({"data-block-id": attrs.id})
            }
        }
    }]}
});

export default BlockID;