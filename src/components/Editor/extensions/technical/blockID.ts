import { Extension } from "@tiptap/react";

const BlockID = Extension.create({
    name: "blockID",
    addGlobalAttributes(){return[{
        types: ["paragraph", "blockquote", "heading", "bulletlist", "image"],
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