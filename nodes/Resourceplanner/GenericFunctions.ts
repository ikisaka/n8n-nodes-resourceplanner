import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

const CREDENTIALS_NAME = 'resourceplannerApi';

type ResourcePlannerCredentials = {
	baseUrl?: string;
};

type ResourcePlannerFunctions = IExecuteFunctions | ILoadOptionsFunctions;

function normalizeBaseUrl(baseUrl?: string): string {
	return (baseUrl || 'https://resourceplanner.io')
		.replace(/\/+$/, '')
		.replace(/\/api$/i, '');
}

export function compactObject(input: IDataObject): IDataObject {
	return Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== ''),
	);
}

export async function resourcePlannerApiRequest(
	this: ResourcePlannerFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials<ResourcePlannerCredentials>(CREDENTIALS_NAME);
	const baseUrl = normalizeBaseUrl(credentials.baseUrl);
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${normalizedEndpoint}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		json: true,
	};

	const compactBody = compactObject(body);
	const compactQuery = compactObject(qs);

	if (Object.keys(compactBody).length > 0) {
		options.body = compactBody;
	}

	if (Object.keys(compactQuery).length > 0) {
		options.qs = compactQuery;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		CREDENTIALS_NAME,
		options,
	)) as IDataObject;
}

export function normalizeJsonInput(value: unknown): unknown {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (typeof value !== 'string') {
		return value;
	}

	return JSON.parse(value);
}
