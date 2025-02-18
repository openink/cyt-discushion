import { Plugin } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";
import { BlockJSON, BlockPJSON, BlockPTypes, omitBlockIDFromAttrs, toFormattedInline, toUUID, UUID } from "../../../../data/block";
import { blockTable } from "../../../../data/db";
import { AddMarkStep, AddNodeMarkStep, AttrStep, DocAttrStep, RemoveMarkStep, RemoveNodeMarkStep, ReplaceAroundStep, ReplaceStep } from "@tiptap/pm/transform";
import { Table } from "dexie";
import { ResolvedPos } from "@tiptap/pm/model";
import { v4 } from "uuid";

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
        let modified = false;
        const { doc, tr } = newState, { doc: oldDoc } = oldState;
        for(let i = 0; i < transactions.length; i++) if(transactions[i].docChanged && transactions[i].getMeta("triggerSave") !== false) for(let j = 0; j < transactions[i].steps.length; j++){
            const step = transactions[i].steps[j];
            /This is a comment/
            if(step instanceof ReplaceStep || step instanceof ReplaceAroundStep){
                /*const affectedNodeIdsInOldDoc :UUID[] = [], stepMap = step.getMap();
                oldDoc.nodesBetween(step.from, step.to, (node, pos, parent, index)=>{
                    if(node.attrs.id === null) console.warn("A node in old doc has empty id:", node);
                    affectedNodeIdsInOldDoc.push(node.attrs.id);
                    if(node.type.name === "paragraph") return false;
                });
                console.log(`${step.from}-${step.to} --> ${stepMap.map(step.from)}-${stepMap.map(step.to)}`);
                console.log(step);
                console.log(affectedNodeIdsInOldDoc.join("\n"));
                //需要处理重复id了:)))))))
                doc.nodesBetween(stepMap.map(step.from), stepMap.map(step.to), (node, pos, parent, index)=>{
                    if(node.attrs.id === null) console.log("create", node);
                    else{
                        if(affectedNodeIdsInOldDoc.includes(node.attrs.id)) console.log("save", node);
                        else console.log("???", node);
                    }
                    if(node.type.name === "paragraph") return false;
                });*/
                //试试直接最大区间！
                const
                stepMap = step.getMap(),
                min = Math.max(0, Math.min(step.from, stepMap.map(step.from))),
                max = Math.min(doc.content.size, Math.max(step.to, stepMap.map(step.to))),
                paragraphsToSave :ResolvedPos[] = [],
                containersToSave :ResolvedPos[] = [];
                doc.nodesBetween(min, max, (node, pos, parent, index)=>{
                    console.log(node);
                    if(node.type.name === "paragraph"){
                        //为了兼容 `saveParagraphParent`，我们在段落起始符后面解析位置，此时需要1的parentOffset
                        //记得如果要拿回段落本身，要减1！减1！！减1！！！减1！！！！减1！！！！减1！！！！减1！！！！减1！！！！
                        paragraphsToSave.push(doc.resolve(pos + 1));
                        return false;
                    }
                    else{
                        console.log("container", doc.resolve(pos));
                    }
                });
                const pTrimSet = new Set<UUID>();
                for(let i = 0; i < paragraphsToSave.length; i++){
                    if(paragraphsToSave[i].parent.attrs.id === null){
                        console.log("get null paragraph to save:", paragraphsToSave[i]);
                        const uuid = v4();
                        tr.setNodeAttribute(paragraphsToSave[i].pos - 1, "id", uuid);
                        modified = true;
                        saveParagraphParent(paragraphsToSave[i], toUUID(uuid));
                    }
                    //自带段落，可能会因为这个产生假阳性重复，提前干掉它们
                    else if(paragraphsToSave[i].parent.attrs.id === "=parent") saveParagraphParent(paragraphsToSave[i]);
                    else if(pTrimSet.has(paragraphsToSave[i].parent.attrs.id)){
                        console.warn("splitted paragraph detected:", paragraphsToSave[i]);
                        const uuid = v4();
                        tr.setNodeAttribute(paragraphsToSave[i].pos - 1, "id", uuid);
                        modified = true;
                        saveParagraphParent(paragraphsToSave[i], toUUID(uuid));
                    }
                    else{
                        pTrimSet.add(paragraphsToSave[i].parent.attrs.id);
                        console.log("save normal:", paragraphsToSave[i]);
                        saveParagraphParent(paragraphsToSave[i]);
                    }
                }
            }
            //跨块级节点的情况下，会自动分解为几个step，所以我们只需要from就能确定所在的节点
            //由于mark不占长度，前后的文档结构完全一致，无需位置映射
            else if(step instanceof AddMarkStep || step instanceof RemoveMarkStep) saveParagraphParent(doc.resolve(step.from));
            else if(step instanceof AttrStep){
                //目前在所有node都还没做任何attrs，所以不知道怎么搞
                const resolved = doc.resolve(step.pos);
                console.log("attr", resolved, resolved.parent);
            }
            //目前不需要做任何事，因为doc属性只有id
            else if(step instanceof DocAttrStep){}
            //我们决定不使用node mark，所有块级/行内块级元素的属性都用attrs
            //所以这里大概率永远不会做事
            else if(step instanceof AddNodeMarkStep || step instanceof RemoveNodeMarkStep){}
            //这里理应没有东西！
            else console.warn("Unexpected Step type:", step);
        }
        return modified ? tr : null;
    }})]}
});

function saveContainer(resolved :ResolvedPos){

}

/**`resolved` 必须是段中的东西
 * **重要提醒**：`node.content.toJSON()` 如果content是空，会™返回null！
*/
async function saveParagraphParent(resolved :ResolvedPos, newId? :UUID){
    const
    node = resolved.parent,
    id :UUID | "=parent" | null = newId ?? node.attrs.id,
    json = toFormattedInline(node.content.toJSON());
    if(node.type.name === "paragraph"){
        console.log("save", node, json, omitBlockIDFromAttrs(node.attrs));
        if(id === null) console.error("Id got null! If you are creating paragraph, pass in `newId` parameter!", node);
        //更新父节点的 `p` 的内容
        else if(id === "=parent"){
            const parentNode = resolved.node(resolved.depth - 1), parentID :UUID | null = parentNode.attrs.id;
            console.log("parent", parentNode.type.name, parentID);
            if(parentID === null) console.warn("Id got null!", parentNode);
            else{
                if(await (blockTable as Table<BlockPJSON<BlockPTypes>, UUID, BlockPJSON<BlockPTypes>>).get(parentID)) (blockTable as Table<BlockPJSON<BlockPTypes>, UUID, BlockPJSON<BlockPTypes>>).update(parentID, {
                    "p.content": json
                });
                else console.warn("Not implemented: Trying to put p content of a non-exist parent node:", resolved, newId);
            }
        }
        //更新自己（独立段落）
        else{
            if(await (blockTable as Table<BlockJSON<"paragraph">, UUID, BlockJSON<"paragraph">>).get(id)) (blockTable as Table<BlockJSON<"paragraph">, UUID, BlockJSON<"paragraph">>).update(id, {
                content: toFormattedInline(node.content.toJSON())
            });
            else (blockTable as Table<BlockJSON<"paragraph">, UUID, BlockJSON<"paragraph">>).add({
                id: id,
                attrs: omitBlockIDFromAttrs(node.attrs),
                content: json,
                type: "paragraph"
            });
        }
    }
    //按理说不会在非paragraph节点触发这个东西
    else console.warn("Trying to save non-paragraph node:", node);
}

export default BlockID;