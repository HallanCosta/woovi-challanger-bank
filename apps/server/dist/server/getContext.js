"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = void 0;
const loaderRegister_1 = require("../modules/loader/loaderRegister");
const getContext = () => {
    const dataloaders = (0, loaderRegister_1.getDataloaders)();
    return {
        dataloaders,
    };
};
exports.getContext = getContext;
