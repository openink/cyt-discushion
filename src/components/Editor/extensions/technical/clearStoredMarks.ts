import { Extension } from "@tiptap/core";

const ClearStoredMarks = Extension.create({
    addKeyboardShortcuts(){return{
        "Mod-q": ()=>{
            console.log(this.editor);
            this.editor.view.dispatch(this.editor.state.tr.setStoredMarks(null));
            this.editor.commands.unsetAllMarks();
            return true;
        }
    }}
});

export default ClearStoredMarks;