import { Extension, getMarkRange } from "@tiptap/core";
import { MarkType } from "@tiptap/pm/model";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        clearMarks: {
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
            { ranges } = selection,
            { marks } = state.schema;
            for(let markName in marks) if(marks[markName] instanceof MarkType) for(let i = 0; i < ranges.length; i++){
                //如果是区间选择，则会清除格式
                tr.removeMark(ranges[i].$from.pos, ranges[i].$to.pos, marks[markName]);
                //如果是空选择（光标），则会清除后续格式
                tr.removeStoredMark(marks[markName]);
            }
            return true;
        }
    }},
    addKeyboardShortcuts(){return{
        "Mod-q": ()=>this.editor.commands.clearMarks()
    }}
});

export default ClearMarks;