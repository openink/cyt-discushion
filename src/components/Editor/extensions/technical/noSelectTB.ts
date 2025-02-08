import { Extension } from "@tiptap/react";

const NoSelectTB = Extension.create({
    name: "noSelectTB",
    onSelectionUpdate(){
        //console.log(this.editor.state.selection);
    }
});

export default NoSelectTB;