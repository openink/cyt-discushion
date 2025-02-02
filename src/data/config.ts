import { UUID } from "./block";

export const dcConfigKeys = ["currentDocument", "sidebarWidth"] as const;
export type DcConfigTypes = typeof dcConfigKeys[number];

export interface DcConfigEntry<T extends DcConfigTypes>{
    key :T;
    value :DcConfigs[T];
}

export interface DcConfigs{
    currentDocument :UUID | null;
    sidebarWidth :number;
}