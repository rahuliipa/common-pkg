import { Instance } from './instance';
export interface RegistryApplication {
    name: string;
    instance: Array<Instance & {
        status: string;
        overriddenstatus: string;
        countryId: number;
        leaseInfo: {
            renewalIntervalInSecs: number;
            durationInSecs: number;
            registrationTimestamp: number;
            lastRenewalTimestamp: number;
            evictionTimestamp: number;
            serviceUpTimestamp: number;
        };
        isCoordinatingDiscoveryServer: 'false' | 'true';
        lastUpdatedTimestamp: number;
        lastDirtyTimestamp: number;
        actionType: string;
    }>;
}
export interface RegistryResponse {
    applications: {
        application: RegistryApplication | RegistryApplication[];
    };
}
