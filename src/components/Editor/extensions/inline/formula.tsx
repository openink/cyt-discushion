import { Node, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

declare module "@tiptap/core"{
    interface Commands<ReturnType>{
        formulaInline: {
            setFormulaInline: ()=>ReturnType;
            unsetFormulaInline: ()=>ReturnType;
        }
    }
}

const FormulaInline = Node.create({
    name: "formulaInline",
    group: "inline",
    inline: true,
    atom: true,
    selectable: true,
    parseHTML: ()=>[
        {tag: "div.dc-fm"}
    ],
    addAttributes(){return{
        latex: {
            default: "",
            isRequired: true,
            keepOnSplit: false,
            parseHTML: element=>element.getAttribute("data-fm-latex"),
            renderHTML: attrs=>({"data-fm-latex": attrs.latex})
        }
    }},
    addNodeView: ()=>ReactNodeViewRenderer(FormulaComp),
    addCommands(){return{
        setFormulaInline: ()=>({dispatch, tr})=>{
            return true;
        }
    }}
});

function FormulaComp(){
    return(<NodeViewWrapper className="dc-fm">
        <NodeViewContent />
    </NodeViewWrapper>);
}