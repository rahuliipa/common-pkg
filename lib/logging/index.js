"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var winston = __importStar(require("winston"));
var format = winston.format;
var color = format.colorize();
color.addColors({
    timestamp: 'grey',
});
var LoggingManager = /** @class */ (function () {
    function LoggingManager() {
        var _this = this;
        this.logLevel = 'info';
        this.loggers = new Map();
        this.enableColors = process.env.NODE_ENV === 'development';
        this.colorize = function (level, message) {
            if (!_this.enableColors) {
                return message;
            }
            return color.colorize(level, message);
        };
        this.createLogger = function (label, options) {
            var level = (options && options.level) || _this.logLevel;
            var logger = winston.createLogger({
                level: level,
                format: format.combine(format.label({ label: label }), format.timestamp(), format.printf(function (info) {
                    var colorizedLabel = _this.colorize(info.level, "[" + label + "]");
                    var colorizedTimestamp = _this.colorize('timestamp', info.timestamp);
                    return colorizedLabel + " " + colorizedTimestamp + " " + (typeof info.message === 'string'
                        ? info.message
                        : util_1.inspect(info.message));
                })),
                transports: [new winston.transports.Console({ level: level })],
            });
            _this.loggers.set(label, logger);
            return logger;
        };
        this.getLogger = function (label, options) {
            if (_this.loggers.has(label))
                return _this.loggers.get(label);
            return _this.createLogger(label, options);
        };
    }
    LoggingManager.prototype.init = function (options) {
        var e_1, _a;
        this.logLevel = options.level;
        if (options.colors !== undefined) {
            this.enableColors = options.colors;
        }
        try {
            for (var _b = __values(this.loggers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), logger = _d[1];
                logger.transports.forEach(function (transport) {
                    transport.level = options.level;
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return LoggingManager;
}());
exports.LoggingManager = LoggingManager;
exports.default = new LoggingManager();
