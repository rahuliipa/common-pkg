"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var instance_1 = require("./instance");
describe('getActivePortAndPrototcol', function () {
    it('returns the secure port if enabled', function () {
        var instance = {
            securePort: {
                $: 443,
                '@enabled': 'true',
            },
            port: {
                $: 80,
                '@enabled': 'true',
            },
        };
        expect(instance_1.getActivePortAndPrototcol(instance)).toEqual({
            activePort: 443,
            protocol: 'https',
        });
    });
    it('returns the insecure port if secure port is not enabled', function () {
        var instance = {
            securePort: {
                $: 443,
                '@enabled': 'false',
            },
            port: {
                $: 80,
                '@enabled': 'true',
            },
        };
        expect(instance_1.getActivePortAndPrototcol(instance)).toEqual({
            activePort: 80,
            protocol: 'http',
        });
    });
});
