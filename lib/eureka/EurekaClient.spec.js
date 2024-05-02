"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var EurekaClient_1 = require("./EurekaClient");
describe('EurekaClient', function () {
    var sampleOptions = {
        logLevel: 'emerg',
        eurekaHost: 'http://test.local',
        registerRetryInterval: 1,
        heartbeatInterval: 1,
        registryInterval: 1,
        retryRegisterAfter: 3,
        instance: {
            app: 'test',
            hostName: 'test',
            healthCheckUrl: '/health',
            statusPageUrl: '/status',
            homePageUrl: '/home',
            ipAddr: '127.0.0.1',
            port: { $: 1234, '@enabled': 'true' },
            securePort: { $: 1235, '@enabled': 'false' },
            version: '1.0.0',
        },
    };
    beforeAll(function () {
        jest.useFakeTimers();
    });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    var mockAxios = function (client) {
        var axios = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
        };
        client.axios = axios;
        return axios;
    };
    it('throws when no options are passed', function () {
        // @ts-ignore
        expect(function () { return new EurekaClient_1.EurekaClient(); }).toThrow();
    });
    describe('register', function () {
        it('starts sending heartbeats and fetching the registry after successful register', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.post.mockResolvedValue({ status: 204 });
                        jest.spyOn(client, 'startHeartbeats');
                        jest.spyOn(client, 'startRegistryFetcher');
                        jest.spyOn(client, 'fetchRegistry');
                        return [4 /*yield*/, client.register()];
                    case 1:
                        _a.sent();
                        expect(client.startHeartbeats).toHaveBeenCalled();
                        expect(client.startRegistryFetcher).toHaveBeenCalled();
                        expect(client.fetchRegistry).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reattempts to register if registration fails', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.post.mockRejectedValue({ status: 404 });
                        jest.spyOn(client, 'register');
                        return [4 /*yield*/, client.register()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(1200);
                        expect(client.register).toBeCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchRegistry', function () {
        it('updates the appCache when only one applcation is returned', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios, appCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.get.mockResolvedValue({
                            data: {
                                applications: {
                                    application: { name: 'foo', instance: [{}] },
                                },
                            },
                        });
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        appCache = client.getAppCache();
                        expect(appCache.has('foo')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates the appCache when multiple applications are returned', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios, appCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.get.mockResolvedValue({
                            data: {
                                applications: {
                                    application: [
                                        {
                                            name: 'foo',
                                            instance: [{}],
                                        },
                                        {
                                            name: 'bar',
                                            instance: [{}],
                                        },
                                    ],
                                },
                            },
                        });
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        appCache = client.getAppCache();
                        expect(appCache.has('foo')).toBeTruthy();
                        expect(appCache.has('bar')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('startRegistryFetcher', function () {
        it('continues to fetch the registry at the specified interval when successful', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.get.mockResolvedValue({
                            data: {
                                applications: {
                                    applcation: { name: 'foo', instance: [{}] },
                                },
                            },
                        });
                        jest.spyOn(client, 'startRegistryFetcher');
                        return [4 /*yield*/, client.startRegistryFetcher()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(2000);
                        expect(client.startRegistryFetcher).toHaveBeenCalledTimes(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('continues to fetch the registry at the specified interval when unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.get.mockRejectedValue({ status: 404 });
                        jest.spyOn(client, 'startRegistryFetcher');
                        return [4 /*yield*/, client.startRegistryFetcher()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(2000);
                        expect(client.startRegistryFetcher).toHaveBeenCalledTimes(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getInstanceByAppId', function () {
        var sampleRegistryData = {
            data: {
                applications: {
                    application: [
                        {
                            name: 'foo',
                            instance: [{}],
                        },
                    ],
                },
            },
        };
        it('rejects if the app is not in the appCache', function () { return __awaiter(_this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        return [4 /*yield*/, expect(client.getInstanceByAppId('unknownApp')).rejects.toBeTruthy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects if it runs out of instances to test when app has multiple instances', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        jest.spyOn(client, 'checkInstanceUp').mockRejectedValue({});
                        axios.get.mockResolvedValue(sampleRegistryData);
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(client.getInstanceByAppId('foo')).rejects.toBeTruthy()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('checks if the instance is up, rejects if down and only one instance', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        jest.spyOn(client, 'checkInstanceUp').mockRejectedValue({});
                        axios.get.mockResolvedValue(sampleRegistryData);
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(client.getInstanceByAppId('foo')).rejects.toBeTruthy()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the url for the instance with the securePort if available', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios, instance, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        instance = {
                            hostName: 'foo-service.local',
                            securePort: {
                                $: 443,
                                '@enabled': 'true',
                            },
                        };
                        jest.spyOn(client, 'checkInstanceUp').mockResolvedValue(instance);
                        axios.get.mockResolvedValue({
                            data: {
                                applications: {
                                    application: [{ name: 'foo', instance: [instance] }],
                                },
                            },
                        });
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client.getInstanceByAppId('foo')];
                    case 2:
                        url = _a.sent();
                        expect(url).toEqual('https://foo-service.local:443');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the url for the instance with the insecure port if available', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios, instance, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        instance = {
                            hostName: 'foo-service.local',
                            port: {
                                $: 3000,
                                '@enabled': 'true',
                            },
                        };
                        jest.spyOn(client, 'checkInstanceUp').mockResolvedValue(instance);
                        axios.get.mockResolvedValue({
                            data: {
                                applications: {
                                    application: [{ name: 'foo', instance: [instance] }],
                                },
                            },
                        });
                        return [4 /*yield*/, client.fetchRegistry()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client.getInstanceByAppId('foo')];
                    case 2:
                        url = _a.sent();
                        expect(url).toEqual('http://foo-service.local:3000');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sendHeartbeat', function () {
        it('sends a PUT request to eureka', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        axios = mockAxios(client);
                        axios.put.mockResolvedValue({});
                        return [4 /*yield*/, client.sendHeartbeat()];
                    case 1:
                        _a.sent();
                        expect(axios.put).toHaveBeenCalledWith(sampleOptions.eurekaHost + "/apps/" + sampleOptions.instance.app + "/" + client.getInstanceId());
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('startHeartbeats', function () {
        it('continues to send heartbeats at the specified interval', function () { return __awaiter(_this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        jest.spyOn(client, 'sendHeartbeat').mockResolvedValue({});
                        return [4 /*yield*/, client.startHeartbeats()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(sampleOptions.heartbeatInterval * 3 * 1000);
                        expect(client.sendHeartbeat).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('sends another heartbeat after a failed attempt if failedHeartbeatAttemps < retryRegisterAfter', function () { return __awaiter(_this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(sampleOptions);
                        jest.spyOn(client, 'sendHeartbeat').mockRejectedValue({});
                        jest.spyOn(client, 'register');
                        return [4 /*yield*/, client.startHeartbeats()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(sampleOptions.heartbeatInterval * 3 * 1000);
                        expect(client.sendHeartbeat).toHaveBeenCalledTimes(2);
                        expect(client.register).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('re-registers after retryRegisterAfter failed heartbeats', function () { return __awaiter(_this, void 0, void 0, function () {
            var client, axios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new EurekaClient_1.EurekaClient(__assign({}, sampleOptions, { retryRegisterAfter: 1 }));
                        axios = mockAxios(client);
                        axios.put.mockRejectedValue({});
                        jest.spyOn(client, 'register').mockResolvedValue({});
                        return [4 /*yield*/, client.startHeartbeats()];
                    case 1:
                        _a.sent();
                        jest.advanceTimersByTime(sampleOptions.heartbeatInterval * 1000);
                        expect(client.register).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
