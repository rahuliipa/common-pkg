export interface Instance {
    app: string;
    version: string;
    hostName: string;
    instanceId?: string;
    ipAddr: string;
    vipAddress?: string;
    secureVipAddress?: string;
    port: InstancePort | null;
    securePort: InstancePort | null;
    homePageUrl: string;
    statusPageUrl: string;
    healthCheckUrl: string;
    metadata?: any;
    dataCenterInfo?: {
        '@class': string;
        name: string;
    };
}
interface InstancePort {
    $: number | null;
    '@enabled': 'true' | 'false';
}
export declare const getActivePortAndPrototcol: (instance: Instance) => {
    activePort: number;
    protocol: string;
};
export declare const createInstanceObject: (instanceId: string, instanceOptions: Instance) => Instance;
export declare const checkInstanceUp: (instance: Instance) => Promise<Instance>;
export declare const createInstanceId: (app: string, version: string) => string;
export {};
