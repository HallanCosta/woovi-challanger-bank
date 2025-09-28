"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebsocketMiddleware = void 0;
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
// work with commonjs and esm
const WebSocketServer = ws_1.WebSocketServer;
const createWebsocketMiddleware = (propertyName = 'ws', options = {}) => {
    if (options instanceof http_1.default.Server)
        options = { server: options };
    // const wsServers = new WeakMap();
    const wsServers = {};
    const getOrCreateWebsocketServer = (url) => {
        // const server = wsServers.get(url);
        const server = wsServers[url];
        if (server) {
            return server;
        }
        // @ts-ignore
        const newServer = new WebSocketServer({
            // @ts-ignore
            ...(options.wsOptions || {}),
            noServer: true,
        });
        wsServers[url] = newServer;
        // wsServers.set(url, newServer);
        return newServer;
    };
    const websocketMiddleware = async (ctx, next) => {
        const upgradeHeader = (ctx.request.headers.upgrade || '')
            .split(',')
            .map((s) => s.trim());
        if (~upgradeHeader.indexOf('websocket')) {
            const wss = getOrCreateWebsocketServer(ctx.url);
            ctx[propertyName] = () => new Promise((resolve) => {
                wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), (ws) => {
                    wss.emit('connection', ws, ctx.req);
                    resolve(ws);
                });
                ctx.respond = false;
            });
            ctx.wss = wss;
        }
        await next();
    };
    return websocketMiddleware;
};
exports.createWebsocketMiddleware = createWebsocketMiddleware;
