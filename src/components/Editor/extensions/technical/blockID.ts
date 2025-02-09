import { Plugin } from "@tiptap/pm/state";
import { Extension, minMax } from "@tiptap/react";
import { BlockJSON, BlockPJSON, BlockPTypes, omitBlockIDFromAttrs, toFormattedInline, UUID } from "../../../../data/block";
import { blockTable } from "../../../../data/db";
import { AddMarkStep, AddNodeMarkStep, AttrStep, DocAttrStep, RemoveMarkStep, RemoveNodeMarkStep, ReplaceAroundStep, ReplaceStep } from "@tiptap/pm/transform";
import { Table } from "dexie";
import { ResolvedPos } from "@tiptap/pm/model";

const BlockID = Extension.create({
    name: "blockID",
    addGlobalAttributes: ()=>[{
        types: ["doc", "paragraph", "blockquote", "heading", "bulletlist", "orderedlist", "heading", "codeBlock"],
        attributes: {
            id: {
                default: null,
                isRequired: true,
                keepOnSplit: false,
                parseHTML: element=>element.getAttribute("data-block-id"),
                renderHTML: attrs=>({"data-block-id": attrs.id})
            }
        }
    }],
    addStorage: ()=>{triggerSave: true},
    addProseMirrorPlugins(){return[new Plugin({appendTransaction(transactions, oldState, newState){
        return undefined;
    }})
    ,new Plugin({appendTransaction(transactions, oldState, newState){
        const {doc} = newState, {doc: oldDoc} = oldState;
        for(let i = 0; i < transactions.length; i++) if(transactions[i].docChanged && transactions[i].getMeta("triggerSave") !== false) for(let j = 0; j < transactions[i].steps.length; j++){
            const step = transactions[i].steps[j];
            /This is a comment/
            if(step instanceof ReplaceStep || step instanceof ReplaceAroundStep){
                const affectedNodes = [], stepMap = step.getMap();
                oldDoc.nodesBetween(step.from, step.to, (node, pos, parent, index)=>{
                    console.log(node);
                    if(node.type.name === "paragraph") return false;
                });
                console.log(`${step.from}-${step.to} --> ${stepMap.map(step.from)}-${stepMap.map(step.to)}`);
                doc.nodesBetween(stepMap.map(step.from), stepMap.map(step.to), (node, pos, parent, index)=>{
                    console.log(node);
                    
                    if(node.type.name === "paragraph") return false;
                });
                //slice为空，代表为纯删除操作
                if(step.slice.size === 0){}
                //纯新增操作
                else if(step.from === step.to){
                    //行内新增
                    if(step.slice.content.content.length === 1){}
                    //跨行新增
                    else{}
                }
                //新增删除操作
                else{}
            }
            //跨块级节点的情况下，会自动分解为几个step，所以我们只需要from就能确定所在的节点
            //由于mark不占长度，前后的文档结构完全一致，无需位置映射
            else if(step instanceof AddMarkStep || step instanceof RemoveMarkStep) saveParagraph(doc.resolve(step.from));
            else if(step instanceof AttrStep){
                //目前在所有node都还没做任何attrs，所以不知道怎么搞
                const resolved = doc.resolve(step.pos);
                console.log(resolved, resolved.parent);
            }
            //目前不需要做任何事，因为doc属性只有id
            else if(step instanceof DocAttrStep){}
            //我们决定不使用node mark，所有块级/行内块级元素的属性都用attrs
            //所以这里大概率永远不会做事
            else if(step instanceof AddNodeMarkStep || step instanceof RemoveNodeMarkStep){}
            //这里理应没有东西！
            else console.warn(`Unexpected Step type:`, step);
        }
        return undefined;
    }})]}
});

function saveContainer(resolved :ResolvedPos){

}

function saveParagraph(resolved :ResolvedPos){
    const node = resolved.parent, id :UUID | "=parent" | null = node.attrs.id;
    if(node.type.name === "paragraph"){
        console.log("save", node, toFormattedInline(node.content.toJSON()), omitBlockIDFromAttrs(node.attrs));
        if(id === null) console.warn("Id got null!", node);
        //更新父节点的 `p` 的内容
        else if(id === "=parent"){
            const parentNode = resolved.node(resolved.depth - 1), parentID :UUID | null = parentNode.attrs.id;
            console.log("parent", parentNode.type.name, parentID);
            if(parentID === null) console.warn("Id got null!", parentNode);
            else (blockTable as Table<BlockPJSON<BlockPTypes>, UUID, BlockPJSON<BlockPTypes>>).update(parentID, {
                "p.content": toFormattedInline(node.content.toJSON())
            });
        }
        //更新自己（独立段落）
        else (blockTable as Table<BlockJSON<"paragraph">, UUID, BlockJSON<"paragraph">>).update(id, {
            content: toFormattedInline(node.content.toJSON())
        });
    }
    //按理说不会在非paragraph节点触发这个东西
    else console.warn("Trying to save non-paragraph node:", node);
}

export default BlockID;