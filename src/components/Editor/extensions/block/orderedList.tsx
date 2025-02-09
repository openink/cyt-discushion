import { InputRule, mergeAttributes, Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const OrderedList = Node.create({
    //https://github.com/ueberdosis/tiptap/blob/b7a7b2ad85cce18449bf856fac8a8b6a301f502c/packages/core/src/inputRules/wrappingInputRule.ts#L68
    name: "orderedlist",
    content: "paragraph block*",
    group: "block dclist container",
    defining: true,
    draggable: true,
    parseHTML: ()=>[
        {tag: "div.dc-ol"},
        {tag: "ol li"},
        {tag: "dc-ol"}
    ],
    addAttributes(){return{
        index: {
            default: 1n,
            isRequired: true,
            keepOnSplit: false,
            parseHTML: element=>BigInt(element.getAttribute("data-ol-index") ?? 1),
            renderHTML: attrs=>({"data-ol-index": attrs.type})
        },
        type: {
            default: "1",
            isRequired: true,
            keepOnSplit: true,
            parseHTML: element=>element.getAttribute("data-ol-type"),
            renderHTML: attrs=>({"data-ol-type": attrs.type})
        },
        reversed: {
            default: false,
            isRequired: true,
            keepOnSplit: true,
            parseHTML: element=>element.getAttribute("data-ol-reversed"),
            renderHTML: attrs=>({"data-ol-reversed": attrs.reversed})
        }
    }},
    //导出的HTML能被再次导入
    renderHTML: ({HTMLAttributes, node})=>["dc-ol", {...HTMLAttributes,
        "data-ol-index": node.attrs.index,
        "data-ol-type": node.attrs.type,
        "data-ol-reversed": node.attrs.reversed
    }, 0],
    addNodeView: ()=>ReactNodeViewRenderer(OrderedListComp),
    addInputRules(){return[
        wrappingInputRule({
            find: /^(\d+)\.\s$/,
            type: this.type,
            getAttributes: match=>({index: match[1] + ""})
        }),
        wrappingInputRule({
            find: /^(i+)\.\s$/,
            type: this.type,
            getAttributes: match=>({
                index: BigInt(match[1].length),
                type: "i"
            })
        }),
        wrappingInputRule({
            find: /^(I+)\.\s$/,
            type: this.type,
            getAttributes: match=>({
                index: BigInt(match[1].length),
                type: "I"
            })
        }),
        wrappingInputRule({
            find: /^(?!i+\.\s$)([a-z]+)\.\s$/,
            type: this.type,
            getAttributes: match=>({
                index: fromBase26(match[1]),
                type: "a"
            })
        }),
        wrappingInputRule({
            find: /^(?!I+\.\s$)([A-Z]+)\.\s$/,
            type: this.type,
            getAttributes: match=>({
                index: fromBase26(match[1]),
                type: "A"
            })
        }),
        wrappingInputRule({
            find: /^(\d+)\,\s$/,
            type: this.type,
            getAttributes: match=>({
                index: BigInt(match[1]),
                reversed: true
            })
        }),
        wrappingInputRule({
            find: /^(i+)\,\s$/,
            type: this.type,
            getAttributes: match=>({
                index: BigInt(match[1].length),
                type: "i",
                reversed: true
            })
        }),
        wrappingInputRule({
            find: /^(I+)\,\s$/,
            type: this.type,
            getAttributes: match=>({
                index: BigInt(match[1].length),
                type: "I",
                reversed: true
            })
        }),
        wrappingInputRule({
            find: /^(?!i+\,\s$)([a-z]+)\,\s$/,
            type: this.type,
            getAttributes: match=>({
                index: fromBase26(match[1]),
                type: "a",
                reversed: true
            })
        }),
        wrappingInputRule({
            find: /^(?!I+\,\s$)([A-Z]+)\,\s$/,
            type: this.type,
            getAttributes: match=>({
                index: fromBase26(match[1]),
                type: "A",
                reversed: true
            })
        })
    ]}
});

export default OrderedList;

function fromBase26(input :string){
    let result = 0n, factor = 1n;
    for(let i = 0; i < input.length; i++){
        result += factor * BigInt(input[input.length - i - 1].toLowerCase().charCodeAt(0) - 96);
        factor *= 26n;
    }
    return result;
}

function OrderedListComp(props :NodeViewProps){
    const {node} = props, localAttrs = {
        "data-ol-index": node.attrs.index,
        "data-ol-type": node.attrs.type,
        "data-ol-reversed": node.attrs.reversed
    };
    return(<NodeViewWrapper className="dc-ol" {...localAttrs}>
        <div className="dc-ol-marker-outer"><div className="dc-ol-marker">{props.node.attrs.index + ""}</div></div>
        <NodeViewContent className="dc-container-outer" />
    </NodeViewWrapper>);
}