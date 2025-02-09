import { Selection } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        trailingP :{
            appendParagraph :()=>ReturnType;
            setSelectionToEnd :()=>ReturnType;
        }
    }
}

const TrailingP = Extension.create({
    name: "trailingP",
    addCommands(){return{
        appendParagraph: ()=>({dispatch, state, commands})=>{
            if(!dispatch) return true;
            commands.insertContentAt(state.doc.content.size, {type: "paragraph"});
            return true;
        },
        //防止撤销地将光标移动到文档最后
        setSelectionToEnd: ()=>({dispatch, tr, state})=>{
            if(!dispatch) return true;
            tr.setSelection(Selection.atEnd(state.doc));
            tr.setMeta("addToHistory", false);
            return true;
        }
    }}
});

export default TrailingP;