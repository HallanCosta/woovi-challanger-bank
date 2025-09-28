"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataloaders = exports.registerLoader = void 0;
const loaders = {};
const registerLoader = (key, getLoader) => {
    loaders[key] = getLoader;
};
exports.registerLoader = registerLoader;
const getDataloaders = () => Object.keys(loaders).reduce((prev, loaderKey) => ({
    ...prev,
    [loaderKey]: loaders[loaderKey](),
}), {});
exports.getDataloaders = getDataloaders;
