import { UUID } from "./block";

export const dcConfigKeys = ["currentDocument"] as const;
export type DcConfigTypes = typeof dcConfigKeys[number];

export interface DcConfigEntry<T extends DcConfigTypes>{
    key :T;
    value :DcConfigs[T];
}

export interface DcConfigs{
    currentDocument :UUID | null | undefined;

}