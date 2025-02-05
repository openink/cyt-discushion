import { Extension, JSONContent } from "@tiptap/react";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        noUndoSetIniContent: {
            setIniContent :(content :JSONContent)=>ReturnType;
        }
    }
}

const NoUndoSetIniContent = Extension.create({
    name: "noUndoSetIniContent",
    addCommands(){return{
        setIniContent: (content :JSONContent)=>({tr, commands})=>{
            tr.setMeta("addToHistory", false);
            return commands.insertContentAt({from: 0, to: tr.doc.content.size}, content);
        }
    }}
});

export default NoUndoSetIniContent;