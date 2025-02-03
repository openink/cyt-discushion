import { Extension } from "@tiptap/react";

const BgColor = Extension.create({
    name: "bgColor",
    addGlobalAttributes(){return[{
        types: ["paragraph", "blockquote", ""],
        attributes: {
            fgColor: {
                default: null,
                isRequired: true,
                keepOnSplit: false,
                parseHTML: element=>findFGColor(element),
                renderHTML: attrs=>({class: attrs.fgColor})
            },
            bgColor: {
                default: null,
                isRequired: true,
                keepOnSplit: false,
                parseHTML: element=>findBGColor(element),
                renderHTML: attrs=>({class: attrs.bgColor})
            }
        }
    }]}
});

export default BgColor;

function findFGColor(element :HTMLElement) :string | null{
    for(let i = 0; i < element.classList.length; i++) if(element.classList[i].match(/^dc-fc-*$/)) return element.classList[i].replace("dc-fc-", "");
    return null;
}

function findBGColor(element :HTMLElement) :string | null{
    for(let i = 0; i < element.classList.length; i++) if(element.classList[i].match(/^dc-bc-*$/)) return element.classList[i].replace("dc-bc-", "");
    return null;
}