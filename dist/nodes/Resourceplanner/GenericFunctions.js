"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactObject = compactObject;
exports.resourcePlannerApiRequest = resourcePlannerApiRequest;
exports.normalizeJsonInput = normalizeJsonInput;
const CREDENTIALS_NAME = 'resourceplannerApi';
function normalizeBaseUrl(baseUrl) {
    return (baseUrl || 'https://resourceplanner.io')
        .replace(/\/+$/, '')
        .replace(/\/api$/i, '');
}
function compactObject(input) {
    return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}
async function resourcePlannerApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials(CREDENTIALS_NAME);
    const baseUrl = normalizeBaseUrl(credentials.baseUrl);
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const options = {
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
    return (await this.helpers.httpRequestWithAuthentication.call(this, CREDENTIALS_NAME, options));
}
function normalizeJsonInput(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value !== 'string') {
        return value;
    }
    return JSON.parse(value);
}
//# sourceMappingURL=GenericFunctions.js.map