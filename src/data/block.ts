import { JSONContent } from "@tiptap/react";
import db from "./db";
import { v4 } from "uuid";
import { DcConfigs, DcConfigEntry } from "./config";

export async function getDocument(docId? :UUID) :Promise<JSONContent>{
    docId = docId ?? await newDocument();
    const cirDetector = new Set<UUID>();
    
}

/****这个函数不是纯函数！**
 * 
 * @returns 新文档的 ID
 * 
 * 我保证后面会单独抽提的 :)
 */
export async function newDocument(){
    const docId = toUUID(v4()), pId = toUUID(v4());
    await db.table<BlockJSON<BlockTypes>>("block").bulkAdd([
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
    await db.table<DcConfigEntry<"currentDocument">>("configs").put({
        key: "currentDocument",
        value: docId
    });
    return docId;
}

export type UUID = string & {readonly uuid_type :unique symbol};

export function toUUID(input :string) :UUID{
    return input as UUID;
}

export type StringAttributeRecord = Record<string, string | null>;

//#region 区块

export const blockPNames = ["doc", "paragraph", "blockquote", "bulletlist", "orderedlist"] as const;
export type BlockPTypes = typeof blockPNames[number];

export const blockNPNames = ["columncontainer"] as const;
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
//所有区块默认必有的一个段落，在最上面。
//如果区块是段落，那么这个就是它的内容，`children` 是它可能嵌套的区块。
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

//#region 行内元素

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

export const markNames = ["bold", "italic", "underline", "strikethrough", "code"] as const;
export type MarkTypes = typeof markNames[number];