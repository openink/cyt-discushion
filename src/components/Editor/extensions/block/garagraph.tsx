import { mergeAttributes, Node } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        garagraph :{
            setGaragraph :()=>ReturnType;
        }
    }
}

const Garagraph = Node.create({
    name: "garagraph",
    content: "paragraph block*",
    group: "block groupable",
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-gp"},
        {tag: "div:has(div.dc-p)"}
    ],
    renderHTML: ({HTMLAttributes})=>["div", mergeAttributes(HTMLAttributes, {class: "dc-gp"}), 0],
    addCommands(){return{
        setGaragraph: ()=>({commands})=>commands.setNode(this.name),
    }},
});

export default Garagraph;