import { Extension } from "@tiptap/react";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        appendParagraph :{
            appendParagraph :()=>ReturnType;
        }
    }
}

const AppendParagraph = Extension.create({
    name: "appendParagraph",
    addCommands(){return{
        appendParagraph: ()=>({dispatch, tr, state, commands})=>{
            if(!dispatch) return true;
            commands.insertContentAt(state.doc.content.size, {type: "paragraph"});
            return true;
        }
    }}
});

export default AppendParagraph;