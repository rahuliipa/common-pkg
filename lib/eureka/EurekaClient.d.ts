/// <reference types="express" />
import { Instance } from './instance';
export interface EurekaOptions {
    eurekaHost: string;
    registerRetryInterval: number;
    heartbeatInterval: number;
    registryInterval: number;
    retryRegisterAfter: number;
    instance: Instance;
    logLevel?: string;
}
export declare class AppUnavailableError extends Error {
    error: {
        statusCode: number;
        message: string;
        reason?: string;
    };
    constructor(reason?: string);
}
export declare class EurekaClient {
    private options;
    private instance;
    private instanceId;
    private appCache;
    private log;
    private heartbeatTimer;
    private registryTimer;
    private registerRetryTimer;
    private failedHeatbeatAttempts;
    private didFetchRegistry;
    private initialRegistryFetchInFlight;
    axios: import("axios").AxiosStatic;
    checkInstanceUp: (instance: Instance) => Promise<Instance>;
    constructor(options: EurekaOptions);
    middleware: (prefix?: string | undefined) => import("express").RequestHandler;
    register: () => Promise<void>;
    deregister: () => import("axios").AxiosPromise<any>;
    fetchRegistry: () => Promise<void>;
    startRegistryFetcher: () => Promise<void>;
    stopRegistryFetcher: () => void;
    getInstanceByAppId: (appId: string, instanceNumber?: number) => Promise<string>;
    sendHeartbeat: () => Promise<void>;
    startHeartbeats: () => Promise<void>;
    stopHeartbeats: () => void;
    getInstanceId: () => string;
    getAppCache: () => Map<string, Instance | Instance[]>;
}
