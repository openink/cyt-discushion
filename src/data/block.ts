import { JSONContent } from "@tiptap/react";
import { blockTable, configTable } from "./db";
import { v4 } from "uuid";

export async function getDocument(docId :UUID | null | undefined) :Promise<JSONContent | null>{
    //type !== "doc" 不应该自动新建文档。目前是直接返回空值
    if(!docId || (await blockTable.get(docId))?.type !== "doc") return null;
    const map = await getDocumentData(docId), breadcrumb :UUID[] = [];
    return mergeDataR(docId)!;
    function mergeDataR(id :UUID) :JSONContent{
        const data = map.get(id)!;
        breadcrumb.push(id);
        //一个区块的子区块不存在。在 getData 中已经扔掉，map 中不会出现，所以会变成 undefined，目前在处理父区块时已经跳过（L33），这里无需处理
        //if(data === undefined){
        //}
        const result :JSONContent = {
            type: data.type === "doc" && breadcrumb.length > 1 ? "docLinkBlock" : data.type,
            attrs: {...data.attrs, id: data.id}
        };
        //data extends ParagraphJSON
        if(data.type === "paragraph") result.content = data.content;
        //data extends BlockPJSON
        //为了和 null 默认状态区分以更好地找出 id 的 bug，这里的 id 设为 =parent
        //仅用于拥有默认段落的块级元素的默认段落，不用于 paragraph
        else{
            if("p" in data) result.content = [{
                type: "paragraph",
                content: data.p.content,
                attrs: {...data.p.attrs, id: "=parent"}
            }];
            if("children" in data && data.children.length) for(let i = 0; i < data.children.length; i++) if(!breadcrumb.includes(data.children[i]) && map.has(data.children[i])){
                if(!("content" in result)) result.content = [mergeDataR(data.children[i])];
                else result.content!.push(mergeDataR(data.children[i]));
            }
        }
        breadcrumb.pop();
        return result;
    }
}

async function getDocumentData(docId :UUID){
    const queue = [docId], data = new Map<UUID, BlockJSON<BlockTypes>>();
    while(queue.length > 0){
        const currentDatas = await blockTable.bulkGet(queue);
        const debugQueue = [...queue];
        queue.length = 0;
        for(let i = 0; i < currentDatas.length; i++){
            if(currentDatas[i] === undefined){
                //没找到对应的区块，我们目前选择直接扔掉这个结果（map里不会出现）
                //后面应该会显示一个错误，单击自动创建一个段落
                console.warn(`Block ${debugQueue[i]} is missing!`);
                continue;
            }
            else{
                if(!data.has(currentDatas[i]!.id)) data.set(currentDatas[i]!.id, currentDatas[i]!);
                if(currentDatas[i]!.type !== "paragraph") for(let j = 0; j < (currentDatas[i]! as BlockJSON<BlockPTypes | BlockNPTypes>).children.length; j++) if(!data.has((currentDatas[i]! as BlockJSON<BlockPTypes | BlockNPTypes>).children[j])) queue.push((currentDatas[i]! as BlockJSON<BlockPTypes | BlockNPTypes>).children[j]);
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
    const docId = toUUID(v4()), pId = toUUID(v4());
    console.log(`Creating new document ${docId} ${pId}`);
    await blockTable.bulkAdd([
        {
            id: docId, /*parents: [],*/ children: [pId], attrs: {}, deleted: false,
            type: "doc", p: {
                attrs: {}, content: [{
                    type: "text",
                    text: "title"
                }]
            }
        },
        {
            id: pId, /*parents: [docId],*/ type: "paragraph", attrs: {},
            content: [{
                type: "text",
                text: "content666"
            }]
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

export function omitBlockIDFromAttrs(attrs :StringAttributeRecord) :StringAttributeRecord{
    const result = {...attrs};
    delete result.id;
    return result;
}

//paragraph已经变成一个独立区块
export const blockPNames = ["doc", "garagraph", "blockquote", "bulletlist", "orderedlist"] as const;
export type BlockPTypes = typeof blockPNames[number];

//没有自带paragraph，但能容纳其他东西的区块
export const blockNPNames = ["columncontainer", "docLinkBlock"] as const;
export type BlockNPTypes = typeof blockNPNames[number];

//不能容纳任何节点的区块
export const blockANames = ["horizontalRule", "image", "iframe"] as const;
export type BlockATypes = typeof blockANames[number];

export type BlockTypes = BlockPTypes | BlockNPTypes | BlockATypes | "paragraph";

export type BlockJSON<T extends BlockTypes> = T extends BlockPTypes ? BlockPJSON<T> : T extends BlockNPTypes ? BlockNPJSON<T> : T extends BlockATypes ? BlockAJSON<T> : T extends "paragraph" ? ParagraphJSON : never;

export interface BlockNPJSON<T extends BlockNPTypes>{
    id :UUID;
    deleted :boolean;
    type :T;
    children :UUID[];
    attrs :StringAttributeRecord;
}

//关于 `p` 的解释
//大部分区块默认必有的一个段落，在最上面。
//如果区块是段落，那么这个就是它的内容，`children` 是它可能嵌套的区块。此时attrs以外部为准。
//如果区块是文档，那么这个就是它的标题。这种设计可以解决 Notion 的标题不完全富文本 bug，但是得在某些地方专门显示纯文本。
//后期某些区块（column）可能没有这个，所以这个从基类型搬到这里了
export interface BlockPJSON<T extends BlockPTypes>{
    id :UUID;
    deleted :boolean;
    type :T;
    children :UUID[];
    attrs :StringAttributeRecord;
    p :{
        //这个纯属多余
        //type :"paragraph";
        attrs :StringAttributeRecord;
        content :InlineJSON<InlineTypes>[];
    };
}

//`BlockAtomic`
export interface BlockAJSON<T extends BlockATypes>{
    id :UUID;
    deleted :boolean;
    type :T;
    attrs :StringAttributeRecord;
}

//现在 `paragraph` 是唯一可以容纳行内节点的东西了
export interface ParagraphJSON{
    id :UUID;
    type :"paragraph";
    attrs :StringAttributeRecord;
    content :InlineJSON<InlineTypes>[];
}


//#endregion

//#region 行内元素类型

export function toFormattedInline(content :JSONContent[] | null) :InlineJSON<InlineTypes>[]{
    console.log(content);
    if(content === null) return [];
    else{
        const result :InlineJSON<InlineTypes>[] = [];
        for(let i = 0; i < content.length; i++){
            if(inlineTNames.includes(content[i].type! as InlineTTypes)){
                result.push({
                    type: content[i].type,
                    text: content[i].text
                } as InlineTJSON<InlineTTypes>);
                if("attrs" in content[i]) result.at(-1)!.attrs = content[i].attrs;
                //不检查mark type合法性
                if("marks" in content[i]) result.at(-1)!.marks = content[i].marks as MarkJSON<MarkTypes>[];
            }
            //肯定是InlineNTTypes，目前没有这部分的节点，先不做
            else{

            }
        }
        return result;
    }
}

export const inlineNTNames = ["mension", "time"] as const;
export type InlineNTTypes = typeof inlineNTNames[number];

export const inlineTNames = ["text", "formulaInline"] as const;
export type InlineTTypes = typeof inlineTNames[number];

export type InlineTypes = InlineTTypes | InlineNTTypes;

export interface InlineTJSON<T extends InlineTTypes>{
    type :T;
    text :string;
    attrs? :StringAttributeRecord;
    marks? :MarkJSON<MarkTypes>[];
}

export interface InlineNTJSON<T extends InlineNTTypes>{
    type :T;
    attrs? :StringAttributeRecord;
    marks? :MarkJSON<MarkTypes>[];
}

export type InlineJSON<T extends InlineTypes> = T extends InlineNTTypes ? InlineNTJSON<T> : T extends InlineTTypes ? InlineTJSON<T> : never;

//#endregion

//#region 标记类型

export interface MarkJSON<T extends MarkTypes>{
    type :T;
    attrs? :StringAttributeRecord;
}

export const markNames = ["bold", "italic", "underline", "strikethrough", "code"] as const;
export type MarkTypes = typeof markNames[number];

//#endregion