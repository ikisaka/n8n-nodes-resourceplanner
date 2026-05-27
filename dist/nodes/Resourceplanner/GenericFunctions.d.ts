import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
type ResourcePlannerFunctions = IExecuteFunctions | ILoadOptionsFunctions;
export declare function compactObject(input: IDataObject): IDataObject;
export declare function resourcePlannerApiRequest(this: ResourcePlannerFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject>;
export declare function normalizeJsonInput(value: unknown): unknown;
export {};
