//@tiptap/extension-code@2.11.3
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        code :{
            setCode: ()=>ReturnType;
            toggleCode: ()=>ReturnType;
            unsetCode: ()=>ReturnType;
        }
    }
}

const Code = Mark.create({
    name: "code",
    //所有其他mark都不能和它共存，目前就先这样
    //excludes: "_",
    priority: 101,
    //不知道干啥用的，有code的东西写就是了
    code: true,
    exitable: true,
    parseHTML: ()=>[{tag: "code"}],
    renderHTML: ({HTMLAttributes})=>["code", HTMLAttributes, 0],
    addCommands(){return{
        setCode: ()=>({commands})=>commands.setMark(this.name),
        toggleCode: ()=>({commands})=>commands.toggleMark(this.name),
        unsetCode: ()=>({commands})=>commands.unsetMark(this.name)
    }},
    addKeyboardShortcuts(){return{
        "Mod-e": ()=>this.editor.commands.toggleCode()
    }},
    addInputRules(){return[
        markInputRule({
            find: /(^|[^`])`([^`]+)`(?!`)/,
            type: this.type
        })
    ]},
    addPasteRules(){return[
        markPasteRule({
            find: /(^|[^`])`([^`]+)`(?!`)/g,
            type: this.type
        })
    ]}
});

export default Code;