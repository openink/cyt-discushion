import { Node } from "@tiptap/core";

export interface ulItemOptions{

}

export const ulItem = Node.create<ulItemOptions>({
    name: "ulItem",
    content: "paragraph block*",
    
});