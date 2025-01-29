import localforage from "localforage";

export function dataInit(){}

localforage.config({
    driver: localforage.INDEXEDDB,
    name: "discushion"
});

const blockStore = localforage.createInstance({
    name: "discushion",
    storeName: "blocks"
});

const viewStore = localforage.createInstance({
    name: "discushion",
    storeName: "views"
});

const themeStore = localforage.createInstance({
    name: "discushion",
    storeName: "themes"
});

const configStore = localforage.createInstance({
    name: "discushion",
    storeName: "configs"
});

export{
    blockStore,
    viewStore,
    themeStore,
    configStore
};