"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var middleware_1 = require("./middleware");
describe('createEurekaMiddleware', function () {
    var baseServerPort = 10500;
    var sampleInstance = {
        app: 'test-app',
        healthCheckUrl: '/health',
        statusPageUrl: '/status',
        homePageUrl: '/',
        hostName: 'test-app',
        ipAddr: '127.0.0.1',
        port: {
            $: 10438,
            '@enabled': 'true',
        },
        securePort: {
            $: 10439,
            '@enabled': 'false',
        },
        version: '1.0.0',
    };
    it('returns a function', function () {
        expect(typeof middleware_1.createEurekaMiddleware(sampleInstance)).toEqual('function');
    });
    it('responds to the correct endpoints', function () { return __awaiter(_this, void 0, void 0, function () {
        var serverPort, uris, middleware, server, listener;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverPort = ++baseServerPort;
                    uris = ['info', 'metrics', 'env', 'health'].map(function (endpoint) { return "http://localhost:" + serverPort + "/" + endpoint; });
                    expect.assertions(uris.length);
                    middleware = middleware_1.createEurekaMiddleware(sampleInstance);
                    server = express_1.default();
                    server.use(middleware);
                    listener = server.listen(serverPort, 'localhost');
                    return [4 /*yield*/, Promise.all(uris.map(function (uri) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, expect(axios_1.default.get(uri, { timeout: 50 })).resolves.toBeTruthy()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1:
                    _a.sent();
                    listener.close();
                    return [2 /*return*/];
            }
        });
    }); });
    it('responds to the correct endpoints with a prefix', function () { return __awaiter(_this, void 0, void 0, function () {
        var serverPort, uris, middleware, server, listener;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverPort = ++baseServerPort;
                    uris = ['info', 'metrics', 'env', 'health'].map(function (endpoint) { return "http://localhost:" + serverPort + "/eureka/" + endpoint; });
                    expect.assertions(uris.length);
                    middleware = middleware_1.createEurekaMiddleware(sampleInstance, '/eureka');
                    server = express_1.default();
                    listener = server.listen(serverPort, 'localhost');
                    server.use(middleware);
                    return [4 /*yield*/, Promise.all(uris.map(function (uri) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, expect(axios_1.default.get(uri, { timeout: 50 })).resolves.toBeTruthy()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1:
                    _a.sent();
                    listener.close();
                    return [2 /*return*/];
            }
        });
    }); });
    it('passes through endpoints that are not its own', function () { return __awaiter(_this, void 0, void 0, function () {
        var serverPort, middleware, server, handler, listener;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect.assertions(1);
                    serverPort = ++baseServerPort;
                    middleware = middleware_1.createEurekaMiddleware(sampleInstance);
                    server = express_1.default();
                    handler = jest.fn().mockImplementation(function (req, res, next) { return res.end(); });
                    listener = server.listen(serverPort, 'localhost');
                    server.use(middleware);
                    server.get('/foo', handler);
                    return [4 /*yield*/, axios_1.default.get("http://localhost:" + serverPort + "/foo", { timeout: 50 })];
                case 1:
                    _a.sent();
                    expect(handler).toHaveBeenCalled();
                    listener.close();
                    return [2 /*return*/];
            }
        });
    }); });
});
