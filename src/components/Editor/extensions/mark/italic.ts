//@tiptap/extension-italic@2.11.3
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        italic :{
            setItalic: ()=>ReturnType;
            toggleItalic: ()=>ReturnType;
            unsetItalic: ()=>ReturnType;
        }
    }
}

const Italic = Mark.create({
    name: "italic",
    parseHTML(){return[
        {tag: "i"},
        {tag: "em"},
        {
            style: "font-style=normal",
            clearMark: mark=>mark.type.name === this.name
        },
        {style: "font-style=italic"}
    ]},
    renderHTML: ({HTMLAttributes})=>["i", HTMLAttributes, 0],
    addCommands(){return{
        setItalic: ()=>({commands})=>commands.setMark(this.name),
        toggleItalic: ()=>({commands})=>commands.toggleMark(this.name),
        unsetItalic: ()=>({commands})=>commands.unsetMark(this.name)
    }},
    addKeyboardShortcuts(){return{
        "Mod-i": ()=>this.editor.commands.toggleItalic()
    }},
    addInputRules(){return[
        markInputRule({
            find: /(?<!\*)\*(?!\s+\*)([^*]+)\*(?!\s+\*)$/,
            type: this.type
        })
    ]},
    addPasteRules(){return[
        markPasteRule({
            find: /(?<!\*)\*(?!\s+\*)([^*]+)\*(?!\s+\*)/g,
            type: this.type
        })
    ]}
});

export default Italic;