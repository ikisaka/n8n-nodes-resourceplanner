import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ResourceplannerApi implements ICredentialType {
	name = 'resourceplannerApi';

	displayName = 'Resource Planner API';

	icon = {
		light: 'file:../nodes/Resourceplanner/resourceplanner.svg',
		dark: 'file:../nodes/Resourceplanner/resourceplanner.dark.svg',
	} as const;

	documentationUrl = 'https://github.com/ikisaka/n8n-nodes-resourceplanner#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://resourceplanner.io',
			placeholder: 'https://resourceplanner.io',
			description:
				'The Resource Planner instance URL. Use the root URL, for example https://resourceplanner.io.',
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{String($credentials.baseUrl || "https://resourceplanner.io").replace(/[/]+$/, "").replace(/[/]api$/i, "")}}',
			url: '/api/projects',
			method: 'GET',
		},
	};
}
