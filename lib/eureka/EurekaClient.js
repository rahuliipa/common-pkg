"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var axios_1 = __importDefault(require("axios"));
var instance_1 = require("./instance");
var middleware_1 = require("./middleware");
var logging_1 = __importDefault(require("../logging"));
var defaultEurekaOptions = {
    registerRetryInterval: 5,
    heartbeatInterval: 5,
    registryInterval: 15,
    retryRegisterAfter: 3,
};
var AppUnavailableError = /** @class */ (function (_super) {
    __extends(AppUnavailableError, _super);
    function AppUnavailableError(reason) {
        var _this = _super.call(this) || this;
        _this.error = {
            statusCode: 503,
            message: 'Service unavailable',
            reason: reason,
        };
        return _this;
    }
    return AppUnavailableError;
}(Error));
exports.AppUnavailableError = AppUnavailableError;
var formatError = function (_a) {
    var code = _a.code, message = _a.message, response = _a.response, _b = _a.config, config = _b === void 0 ? {} : _b;
    return util_1.inspect({
        statusCode: code,
        message: message,
        url: config.url,
        method: config.method,
        response: response,
    });
};
var EurekaClient = /** @class */ (function () {
    function EurekaClient(options) {
        var _this = this;
        this.appCache = new Map();
        this.heartbeatTimer = null;
        this.registryTimer = null;
        this.registerRetryTimer = null;
        this.failedHeatbeatAttempts = 0;
        this.didFetchRegistry = false;
        this.initialRegistryFetchInFlight = null;
        // this allows these functions to be mocked in tests
        this.axios = axios_1.default;
        this.checkInstanceUp = instance_1.checkInstanceUp;
        this.middleware = function (prefix) {
            return middleware_1.createEurekaMiddleware(_this.instance, prefix);
        };
        this.register = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, eurekaHost, registerRetryInterval, heartbeatInterval, registryInterval, _b, app, hostName, res, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.options, eurekaHost = _a.eurekaHost, registerRetryInterval = _a.registerRetryInterval, heartbeatInterval = _a.heartbeatInterval, registryInterval = _a.registryInterval, _b = _a.instance, app = _b.app, hostName = _b.hostName;
                        this.log.info('registering with eureka');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.axios.post(eurekaHost + "/apps/" + app, { instance: this.instance }, { responseType: 'json' })];
                    case 2:
                        res = _c.sent();
                        if (res.status !== 204) {
                            throw new Error(res.statusText);
                        }
                        this.log.info("registered with " + eurekaHost);
                        this.log.info("hostname is " + hostName);
                        this.log.info("instance ID is " + this.instanceId);
                        this.log.info("starting registry fetcher at interval of " + registryInterval + " seconds");
                        this.startRegistryFetcher();
                        this.log.info("starting heartbeats at interval of " + heartbeatInterval + " seconds");
                        return [2 /*return*/, this.startHeartbeats()];
                    case 3:
                        err_1 = _c.sent();
                        this.log.error("registration failure: " + formatError(err_1));
                        this.log.info("retrying registration in " + registerRetryInterval + " seconds");
                        this.registerRetryTimer = setTimeout(this.register, registerRetryInterval * 1000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deregister = function () {
            var _a = _this.options, eurekaHost = _a.eurekaHost, app = _a.instance.app;
            if (_this.registerRetryTimer)
                clearTimeout(_this.registerRetryTimer);
            return _this.axios.delete(eurekaHost + "/apps/" + app + "/" + encodeURIComponent(_this.instanceId));
        };
        this.fetchRegistry = function () { return __awaiter(_this, void 0, void 0, function () {
            var eurekaHost, res, applications, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eurekaHost = this.options.eurekaHost;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.axios.get(eurekaHost + "/apps", {
                                responseType: 'json',
                            })];
                    case 2:
                        res = _a.sent();
                        applications = void 0;
                        if (Array.isArray(res.data.applications.application)) {
                            applications = res.data.applications.application;
                        }
                        else {
                            applications = [res.data.applications.application];
                        }
                        this.log.debug("fetched registry, got " + applications.length + " applications");
                        applications.reduce(function (cache, _a) {
                            var name = _a.name, instance = _a.instance;
                            cache.set(name.toLowerCase(), instance);
                            return cache;
                        }, this.appCache);
                        this.initialRegistryFetchInFlight = null;
                        this.didFetchRegistry = true;
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        this.log.error("registry fetch error: " + formatError(err_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.startRegistryFetcher = function () { return __awaiter(_this, void 0, void 0, function () {
            var registryInterval;
            return __generator(this, function (_a) {
                registryInterval = this.options.registryInterval;
                this.stopRegistryFetcher();
                try {
                    this.initialRegistryFetchInFlight = this.fetchRegistry();
                }
                finally {
                    this.registryTimer = setTimeout(this.startRegistryFetcher, registryInterval * 1000);
                }
                return [2 /*return*/];
            });
        }); };
        this.stopRegistryFetcher = function () {
            if (_this.registryTimer)
                clearTimeout(_this.registryTimer);
        };
        this.getInstanceByAppId = function (appId, instanceNumber) {
            if (instanceNumber === void 0) { instanceNumber = 0; }
            return __awaiter(_this, void 0, void 0, function () {
                var instances, instanceToTest, instance, _a, activePort, protocol, url, err_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.didFetchRegistry && this.initialRegistryFetchInFlight)) return [3 /*break*/, 2];
                            this.log.debug(appId + ": waiting for initial registry fetch");
                            return [4 /*yield*/, this.initialRegistryFetchInFlight];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            instances = this.appCache.get(appId.toLowerCase());
                            if (!instances) {
                                this.log.error(appId + " is unreachable");
                                throw new AppUnavailableError('app is not in cache');
                            }
                            if (Array.isArray(instances)) {
                                if (!instances[instanceNumber]) {
                                    this.log.error(appId + " is unreachable");
                                    throw new AppUnavailableError('app has no available instances');
                                }
                                instanceToTest = instances[instanceNumber];
                            }
                            else {
                                instanceToTest = instances;
                            }
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.checkInstanceUp(instanceToTest)];
                        case 4:
                            instance = _b.sent();
                            _a = instance_1.getActivePortAndPrototcol(instance), activePort = _a.activePort, protocol = _a.protocol;
                            url = protocol + "://" + instance.hostName + ":" + activePort;
                            this.log.debug("got url for " + appId + ": " + url);
                            return [2 /*return*/, url];
                        case 5:
                            err_3 = _b.sent();
                            if (Array.isArray(instances)) {
                                return [2 /*return*/, this.getInstanceByAppId(appId, instanceNumber + 1)];
                            }
                            else {
                                this.log.error(appId + " is unreachable");
                                throw new AppUnavailableError('app is down');
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        this.sendHeartbeat = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, eurekaHost, app, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.options, eurekaHost = _a.eurekaHost, app = _a.instance.app;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.axios.put(eurekaHost + "/apps/" + app + "/" + this.instanceId)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _b.sent();
                        this.failedHeatbeatAttempts += 1;
                        this.log.error("heartbeat error, attempt " + this.failedHeatbeatAttempts + ": " + formatError(err_4));
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.startHeartbeats = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, retryRegisterAfter, heartbeatInterval, err_5, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.options, retryRegisterAfter = _a.retryRegisterAfter, heartbeatInterval = _a.heartbeatInterval;
                        this.stopHeartbeats();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 8, 9]);
                        return [4 /*yield*/, this.sendHeartbeat()];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        err_5 = _c.sent();
                        if (!(this.failedHeatbeatAttempts >= retryRegisterAfter)) return [3 /*break*/, 7];
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.register()];
                    case 5:
                        _c.sent();
                        this.failedHeatbeatAttempts = 0;
                        return [3 /*break*/, 7];
                    case 6:
                        _b = _c.sent();
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        this.heartbeatTimer = setTimeout(this.startHeartbeats, heartbeatInterval * 1000);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.stopHeartbeats = function () {
            if (_this.heartbeatTimer)
                clearTimeout(_this.heartbeatTimer);
        };
        this.getInstanceId = function () { return _this.instanceId; };
        // this is only necessary for tests
        this.getAppCache = function () { return _this.appCache; };
        if (!options) {
            throw new Error('Missing eureka options');
        }
        this.log = logging_1.default.getLogger('eureka', { level: options.logLevel });
        this.options = __assign({}, defaultEurekaOptions, options);
        this.instanceId = instance_1.createInstanceId(options.instance.app, options.instance.version);
        this.instance = instance_1.createInstanceObject(this.instanceId, this.options.instance);
    }
    return EurekaClient;
}());
exports.EurekaClient = EurekaClient;
