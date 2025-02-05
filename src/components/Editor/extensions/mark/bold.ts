//@tiptap/extension-bold@2.11.3
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        bold: {
            setBold :()=>ReturnType;
            toggleBold :()=>ReturnType;
            unsetBold :()=>ReturnType;
        }
    }
}

const Bold = Mark.create({
    name: "bold",
    parseHTML(){return[
        {tag: "strong"},
        {tag: "b"},
        {
            //如果是正常字重，就把加粗标记直接干掉
            style: "font-weight=400",
            clearMark: mark=>mark.type.name === this.name,
        },
        {
            //如果字重在500-999之间就设置加粗标记（即返回null）
            style: "font-weight",
            getAttrs: value=>/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
        }
    ]},
    renderHTML: ({HTMLAttributes})=>["b", HTMLAttributes, 0],
    addCommands(){return{
        setBold: ()=>({commands})=>commands.setMark(this.name),
        toggleBold: ()=>({commands})=>commands.toggleMark(this.name),
        unsetBold: ()=>({commands})=>commands.unsetMark(this.name)
    }},
    addKeyboardShortcuts(){return{
        "Mod-b": ()=>this.editor.commands.toggleBold()
    }},
    addInputRules(){return[
        markInputRule({
            find: /\*\*(?!\s+\*\*)([^*]+)\*\*(?!\s+\*\*)$/,
            type: this.type
        })
    ]},
    addPasteRules(){return[
        markPasteRule({
            find: /\*\*(?!\s+\*\*)([^*]+)\*\*(?!\s+\*\*)/g,
            type: this.type
        })
    ]}
});

export default Bold;