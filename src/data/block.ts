import { JSONContent } from "@tiptap/react";
import { blockTable, configTable } from "./db";
import { v4 } from "uuid";
import { DcConfigEntry } from "./config";

export async function getDocument(docId :UUID | null | undefined) :Promise<JSONContent>{
    //fixme:按理说 type !== "doc" 不应该自动新建文档。
    //不过先这样吧
    if(!docId || (await blockTable.get(docId))?.type !== "doc") docId = await newDocument();
    const map = await getDocumentData(docId), breadcrumb :UUID[] = [];
    return mergeDataR(docId)!;
    function mergeDataR(id :UUID) :JSONContent{
        const data = map.get(id)!;
        breadcrumb.push(id);
        //一个区块引用了不存在的区块。在getData中已经扔掉，这里不会出现
        //if(data === undefined){
        //}
        const result :JSONContent = {
            type: data.type === "doc" && breadcrumb.length > 1 ? "docLinkBlock" : data.type,
            attrs: {...data.attrs, id: data.id}
        };
        if("p" in data){
            if(data.type === "paragraph") result.content = data.p.content;
            else result.content = [{
                type: "paragraph",
                content: data.p.content,
                attrs: data.p.attrs
            }];
        }
        if(data.children.length) for(let i = 0; i < data.children.length; i++) if(!breadcrumb.includes(data.children[i])){
            if(!("content" in result)) result.content = [mergeDataR(data.children[i])];
            else result.content!.push(mergeDataR(data.children[i]));
        }
        breadcrumb.pop();
        return result;
    }
}

async function getDocumentData(docId :UUID){
    const queue = [docId], data = new Map<UUID, BlockJSON<BlockTypes>>();
    while(queue.length > 0){
        const currentDatas = await blockTable.bulkGet(queue);
        queue.length = 0;
        for(let i = 0; i < currentDatas.length; i++){
            if(currentDatas[i] === undefined){
                //没找到对应的区块，我们目前选择直接扔掉这个结果（map里不会出现）
                //后面应该会显示一个错误，单击自动创建一个段落
                continue;
            }
            else{
                if(!data.has(currentDatas[i]!.id)) data.set(currentDatas[i]!.id, currentDatas[i]!);
                for(let j = 0; j < currentDatas[i]!.children.length; j++) if(!data.has(currentDatas[i]!.children[j])) queue.push(currentDatas[i]!.children[j]);
            }
        }
    }
    return data;
}

/****这个函数不是纯函数！**
 * 
 * @returns 新文档的 ID
 * 
 * fixme:我保证后面会单独抽提的 :)
 */
export async function newDocument(){
    console.log("creating new document");
    const docId = toUUID(v4()), pId = toUUID(v4());
    await blockTable.bulkAdd([
        {
            id: docId, parents: [], children: [pId],
            type: "doc", p: {
                attrs: {}, content: [{
                    type: "text",
                    attrs: {},
                    text: "title"
                }]
            }
        },
        {
            id: pId, parents: [docId], children: [],
            type: "paragraph", p: {
                attrs: {}, content: [{
                    type: "text",
                    attrs: {},
                    text: "content666"
                }]
            }
        }
    ]);
    await configTable.put({
        key: "currentDocument",
        value: docId
    });
    return docId;
}

export type UUID = string & {readonly uuid_type :unique symbol};
export function toUUID(input :string) :UUID{return input as UUID;}

export type StringAttributeRecord = Record<string, string | null>;

//#region 区块类型

export const blockPNames = ["doc", "paragraph", "blockquote", "bulletlist", "orderedlist"] as const;
export type BlockPTypes = typeof blockPNames[number];

export const blockNPNames = ["columncontainer", "docLinkBlock"] as const;
export type BlockNPTypes = typeof blockNPNames[number];

export type BlockTypes = BlockPTypes | BlockNPTypes;

export interface BlockNPJSON<T extends BlockNPTypes>{
    id :UUID;
    type :T;
    children :UUID[];
    parents :UUID[];
    attrs? :StringAttributeRecord;
}

//关于 `p` 的解释
//大部分区块默认必有的一个段落，在最上面。
//如果区块是段落，那么这个就是它的内容，`children` 是它可能嵌套的区块。此时attrs以外部为准。
//如果区块是文档，那么这个就是它的标题。这种设计可以解决 Notion 的标题不完全富文本 bug，但是得在某些地方专门显示纯文本。
//后期某些区块（column）可能没有这个，所以这个从基类型搬到这里了
export interface BlockPJSON<T extends BlockPTypes>{
    id :UUID;
    type :T;
    children :UUID[];
    parents :UUID[];
    attrs? :StringAttributeRecord;
    p :{
        //这个纯属多余
        //type :"paragraph";
        attrs :StringAttributeRecord;
        content :InlineJSON<InlineTypes>[];
    };
}

export type BlockJSON<T extends BlockTypes> = T extends BlockNPTypes ? BlockNPJSON<T> : T extends BlockPTypes ? BlockPJSON<T> : never;

//#endregion

//#region 行内元素类型

export const inlineNTNames = ["mension", "time"] as const;
export type InlineNTTypes = typeof inlineNTNames[number];

export const inlineTNames = ["text", "equation"] as const;
export type InlineTTypes = typeof inlineTNames[number];

export type InlineTypes = InlineTTypes | InlineNTTypes;

export interface InlineTJSON<T extends InlineTTypes>{
    type :T;
    attrs? :StringAttributeRecord;
    marks? :{
        type :MarkTypes;
        attrs? :StringAttributeRecord;
    }[];
    text :string;
}

export interface InlineNTJSON<T extends InlineNTTypes>{
    type :T;
    attrs? :StringAttributeRecord;
    marks? :{
        type :MarkTypes;
        attrs? :StringAttributeRecord;
    }[];
}

export type InlineJSON<T extends InlineTypes> = T extends InlineNTTypes ? InlineNTJSON<T> : T extends InlineTTypes ? InlineTJSON<T> : never;

//#endregion

//#region 标记类型

export const markNames = ["bold", "italic", "underline", "strikethrough", "code"] as const;
export type MarkTypes = typeof markNames[number];

//#endregion