import { Node } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";

const PmtbFix = Extension.create({
    name: "pmtbFix",
    addProseMirrorPlugins(){return[new Plugin({
        //阻止用户在选区最前面或最后面出现空段
        //可以直接阻止用户完全只选择空段
        //如果用户选择了中间有空段的选区，不要动它，pm也不支持中空选区（其实浏览器都不支持）
        props: {
            handleDOMEvents: { pointerup(view){
                const { state, dispatch } = view, { selection, doc, tr } = state;
                if(!selection.empty){
                    const
                    selectedNodes :{node :Node, pos :number}[] = [],
                    reversed = selection.anchor > selection.head;
                    doc.nodesBetween(selection.from, selection.to, (node, pos)=>{
                        selectedNodes.push({node, pos});
                        if(node.type.name === "paragraph") return false;
                    });
                    //console.log(selectedNodes);
                    const
                    emptyFrom = selectedNodes[0].node.textContent === "",
                    emptyTo = selectedNodes.at(-1)!.node.textContent === "";
                    if(!emptyFrom && !emptyTo) return;
                    else if(emptyFrom && emptyTo){
                        console.log(selection.from);
                        dispatch(tr.setSelection(TextSelection.create(doc, selection.anchor, selection.anchor)));
                    }
                    else{
                        let firstNotEmptyFrom = selection.from, lastNotEmptyTo = selection.to;
                        for(let i = 0; i < selectedNodes.length; i++){
                            if(selectedNodes[i].node.textContent === "") firstNotEmptyFrom += 2;
                            else break;
                        }
                        for(let i = selectedNodes.length - 1; i >= 0; i--){
                            if(selectedNodes[i].node.textContent === "") lastNotEmptyTo -= 2;
                            else break;
                        }
                        dispatch(tr.setSelection(TextSelection.create(doc, reversed ? lastNotEmptyTo : firstNotEmptyFrom, reversed ? firstNotEmptyFrom : lastNotEmptyTo)));
                    }
                }
            }},
            handleDoubleClickOn(view, pos, node, nodePos){
                if(node.type.name === "paragraph"){
                    const { state, dispatch } = view, { doc, tr } = state;
                    if(node.textContent === ""){
                        dispatch(tr.setSelection(TextSelection.create(doc, nodePos + 1, nodePos + 1)));
                        return true;
                    }
                    else dispatch(tr.setSelection(TextSelection.create(doc, nodePos + 1, nodePos + node.content.size + 1)));
                }
            }
        }
    })]}
});

export default PmtbFix;