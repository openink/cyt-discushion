import { InputRule, mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const OrderedList = Node.create({
    //避开Tiptap对ul和ol的特殊处理。eg：
    name: "_orderedList",
    content: "paragraph block*",
    group: "block list",
    defining: true,
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-ol"},
        {tag: "ol li"},
        {tag: "dc-ol"}
    ],
    addAttributes(){return{
        start: {
            default: 1,
            isRequired: false,
            keepOnSplit: false,
            parseHTML: element=>element.getAttribute("start")
        },
        type: {
            default: "1",
            isRequired: false,
            keepOnSplit: true,
            parseHTML: element=>element.getAttribute("type"),
            renderHTML: attrs=>({"type": attrs.type})
        },
        reversed: {
            default: false,
            isRequired: false,
            keepOnSplit: true,
            parseHTML: element=>element.getAttribute("reversed"),
            renderHTML: attrs=>({"reversed": attrs.reversed})
        }
    }},
    //导出的HTML能被再次导入
    renderHTML: ({HTMLAttributes})=>["dc-ol", mergeAttributes(HTMLAttributes)],
    addNodeView: ()=>ReactNodeViewRenderer(OrderedListComp),
    addInputRules(){return[
        new InputRule({
            find: /^(\d+)\.\s$/,
            handler(props){
                console.log(props);
            }
        }),
        new InputRule({
            find: /^(i+)\.\s$/,
            handler(props){
                
            }
        })
    ]}
});

export default OrderedList;

function OrderedListComp(props :NodeViewProps){
    
    return(<NodeViewWrapper className="dc-ol">
        <div className="dc-ol-marker-outer"><div className="dc-ol-marker">321</div></div>
        <NodeViewContent className="dc-container-outer" />
    </NodeViewWrapper>);
}