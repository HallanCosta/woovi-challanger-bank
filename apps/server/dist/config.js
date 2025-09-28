"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const cwd = process.cwd();
const root = path_1.default.join.bind(cwd);
dotenv_safe_1.default.config({
    path: root('.env'),
    sample: root('.env.example'),
});
const ENV = process.env;
const config = {
    PORT: ENV.PORT ?? 4000,
    MONGO_URI: ENV.MONGO_URI ?? '',
    REDIS_HOST: ENV.REDIS_HOST ?? '',
};
exports.config = config;
