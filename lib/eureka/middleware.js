"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var os_1 = __importDefault(require("os"));
var instance_1 = require("./instance");
function createEurekaMiddleware(instance, routePrefix) {
    if (routePrefix === void 0) { routePrefix = ''; }
    var activePort = instance_1.getActivePortAndPrototcol(instance).activePort;
    var eurekaMiddleware = function (req, res, next) {
        switch (req.path) {
            case path_1.default.join(routePrefix, '/info'):
                return res.json({ status: 'UP', version: instance.version });
            case path_1.default.join(routePrefix, '/metrics'):
                return res.json(metrics());
            case path_1.default.join(routePrefix, '/env'):
                return res.json(env(activePort));
            case path_1.default.join(routePrefix, '/health'):
                return res.json(health(instance.app));
            default:
                return next();
        }
    };
    return eurekaMiddleware;
}
exports.createEurekaMiddleware = createEurekaMiddleware;
function env(activePort) {
    return {
        profiles: [process.env.NODE_ENV],
        'server.ports': {
            'local.server.port': activePort,
        },
        commandLineArgs: process.argv,
        systemProperties: process.config,
        systemEnvironment: process.env,
    };
}
function health(appName) {
    return {
        description: appName,
        status: 'UP',
        // TODO: diskSpace
        diskSpace: {
            status: 'UP',
            total: 10000,
            free: 10000,
            threshold: 100,
        },
    };
}
function metrics() {
    var _a = process.memoryUsage(), heapTotal = _a.heapTotal, heapUsed = _a.heapUsed;
    var uptime = Math.round(process.uptime());
    var processors = os_1.default.cpus().length;
    var _b = __read(os_1.default.loadavg(), 1), loadAvg = _b[0];
    return {
        uptime: uptime,
        processors: processors,
        mem: os_1.default.totalmem() / 1024,
        'mem.free': os_1.default.freemem() / 1024,
        'instance.uptime': uptime,
        'systemload.average': loadAvg,
        heap: heapTotal,
        'heap.used': heapUsed,
    };
}
