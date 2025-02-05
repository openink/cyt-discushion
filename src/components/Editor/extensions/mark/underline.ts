//@tiptap/extension-underline@2.11.3
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        underline: {
            setUnderline: ()=>ReturnType;
            toggleUnderline: ()=>ReturnType;
            unsetUnderline: ()=>ReturnType;
        }
    }
}

const Underline = Mark.create({
    name: "underline",
    parseHTML(){return[
        {tag: "u"},
        {
            style: "text-decoration",
            getAttrs: style=>style.includes("underline") ? {} : false
        }
    ]},
    renderHTML: ({ HTMLAttributes })=>["u", HTMLAttributes, 0],
    addCommands(){return{
        setUnderline: ()=>({commands})=>commands.setMark(this.name),
        toggleUnderline: ()=>({commands})=>commands.toggleMark(this.name),
        unsetUnderline: ()=>({commands})=>commands.unsetMark(this.name)
    }},
    addKeyboardShortcuts(){return{
        "Mod-u": ()=>this.editor.commands.toggleUnderline()
    }},
    addInputRules(){return[
        markInputRule({
            find: /(?<!_)_(?!\s+_)([^_]+)_(?!\s+_)$/,
            type: this.type
        })
    ]},
    addPasteRules(){return[
        markPasteRule({
            find: /(?<!_)_(?!\s+_)([^*]+)_(?!\s+_)/g,
            type: this.type
        })
    ]}
});

export default Underline;