import path from "path";

function getFullPath(relativePath: string): string {

    return path.join(__dirname, relativePath);
}

export interface IConfig {

    port: string;
    MONGODB_URI: string;
    htmlAssetPath: string;
    publicAssetsPath: string;
}

export const config: IConfig = {

    port: process.env.PORT || "3001",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/lrmatch",
    htmlAssetPath: getFullPath("../../client/build/index.html"),
    publicAssetsPath: getFullPath("../../client/build")
};