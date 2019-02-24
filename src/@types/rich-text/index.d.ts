/// <reference types="node" />

declare module "rich-text" {
    export function type(type: { name?: string, uri?: string, [key: string]: any}): void;
}
