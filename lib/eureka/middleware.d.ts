import { RequestHandler } from 'express';
import { Instance } from './instance';
export declare function createEurekaMiddleware(instance: Instance, routePrefix?: string): RequestHandler;
