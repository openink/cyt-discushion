import { Extension } from "@tiptap/react";

const PmtbFix = Extension.create({
    name: "pmtbFix",
    //阻止用户选择
    onSelectionUpdate(){
        //console.log(this.editor.state.selection);
    }
});

export default PmtbFix;