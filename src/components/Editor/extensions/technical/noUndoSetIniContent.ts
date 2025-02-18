import { Extension, JSONContent } from "@tiptap/react";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        noUndoSetIniContent :{
            setIniContent :(content :JSONContent | null)=>ReturnType;
        }
    }
}

const NoUndoSetIniContent = Extension.create({
    name: "noUndoSetIniContent",
    addCommands(){return{
        setIniContent: (content :JSONContent | null)=>({tr, commands})=>{
            if(!content) return false;
            tr.setMeta("addToHistory", false);
            tr.setMeta("triggerSave", false);
            tr.setDocAttribute("id", content.attrs!.id);
            //Emit update for debug use.
            commands.focus("end");
            return commands.setContent(content, true);
        }
    }}
});

export default NoUndoSetIniContent;