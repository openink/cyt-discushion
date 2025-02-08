import { Extension } from "@tiptap/core";
import { MarkType } from "@tiptap/pm/model";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        clearMarks :{
            clearMarks: ()=>ReturnType;
        }
    }
}

const ClearMarks = Extension.create({
    name: "clearMarks",
    addCommands(){return{
        clearMarks: ()=>({dispatch, state, tr})=>{
            if(!dispatch) return true;
            const
            { selection } = state,
            { ranges, empty } = selection,
            { marks } = state.schema;
            for(let markName in marks) if(marks[markName] instanceof MarkType) for(let i = 0; i < ranges.length; i++){
                //如果是空选择（光标），则会清除后续格式
                if(empty) tr.removeStoredMark(marks[markName]);
                //如果是区间选择，则会清除格式
                else tr.removeMark(ranges[i].$from.pos, ranges[i].$to.pos, marks[markName]);
                console.log("cleared", markName);
            }
            return true;
        }
    }},
    addKeyboardShortcuts(){return{
        "Mod-q": ()=>this.editor.commands.clearMarks()
    }}
});

export default ClearMarks;