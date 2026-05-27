"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceplannerApi = void 0;
class ResourceplannerApi {
    constructor() {
        this.name = 'resourceplannerApi';
        this.displayName = 'Resource Planner API';
        this.icon = {
            light: 'file:../nodes/Resourceplanner/resourceplanner.svg',
            dark: 'file:../nodes/Resourceplanner/resourceplanner.dark.svg',
        };
        this.documentationUrl = 'https://github.com/ikisaka/n8n-nodes-resourceplanner#credentials';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                required: true,
                default: 'https://resourceplanner.io',
                placeholder: 'https://resourceplanner.io',
                description: 'The Resource Planner instance URL. Use the root URL, for example https://resourceplanner.io.',
            },
            {
                displayName: 'API Access Key',
                name: 'accessToken',
                type: 'string',
                typeOptions: { password: true },
                required: true,
                default: '',
                description: 'Workspace API access key generated in Resource Planner settings',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{String($credentials.baseUrl || "https://resourceplanner.io").replace(/[/]+$/, "").replace(/[/]api$/i, "")}}',
                url: '/api/projects',
                method: 'GET',
            },
        };
    }
}
exports.ResourceplannerApi = ResourceplannerApi;
//# sourceMappingURL=ResourceplannerApi.credentials.js.map