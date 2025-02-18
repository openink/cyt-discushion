import { TextSelection } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";


const CtrlA = Extension.create({
    name: "ctrla",
    addKeyboardShortcuts(){return{
        "Mod-a": ({ editor })=>{
            const { state, view } = editor, { doc, selection, tr } = state, { $anchor, $head } = selection;
            console.log(editor, selection);
            if(selection.$anchor.parent === selection.$head.parent){
                //不能工作的的代码
                tr.setSelection(TextSelection.create(doc, $anchor.pos - $anchor.parentOffset + 1, $head.pos - $head.parentOffset + $anchor.parent.content.size + 1));
            }
            else{

            }
            //
            return false;
        }
    }}
});

export default CtrlA;