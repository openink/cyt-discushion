//@tiptap/extension-strike@2.11.3
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        strike :{
            setStrike: ()=>ReturnType;
            toggleStrike: ()=>ReturnType;
            unsetStrike: ()=>ReturnType;
        }
    }
}

const Strike = Mark.create({
    name: "strike",
    parseHTML(){return[
        {tag: "s"},
        {tag: "del"},
        {tag: "strike"},
        {
            style: "text-decoration",
            getAttrs: style=>style.includes("line-through") ? {} : false
        }
    ]},
    renderHTML: ({HTMLAttributes})=>["s", HTMLAttributes, 0],
    addCommands(){return{
        setStrike: ()=>({commands})=>commands.setMark(this.name),
        toggleStrike: ()=>({commands})=>commands.toggleMark(this.name),
        unsetStrike: ()=>({commands})=>commands.unsetMark(this.name)
    }},
    addKeyboardShortcuts(){return{
        "Mod-s": ()=>this.editor.commands.toggleStrike()
    }},
    addInputRules(){return[
        markInputRule({
            find: /~~(?!\s+~~)([^~]+)~~(?!\s+~~)$/,
            type: this.type
        })
    ]},
    addPasteRules(){return[
        markPasteRule({
            find: /~~(?!\s+~~)([^~]+)~~(?!\s+~~)/g,
            type: this.type
        })
    ]}
});

export default Strike;