/// <reference types="node" />

declare module "sharedb-mongo" {
    export = ShareDBMongo;
}

declare class ShareDBMongo {
    constructor(connectionString: string)
}
