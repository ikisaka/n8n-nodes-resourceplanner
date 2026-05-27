import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ResourceplannerApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:../nodes/Resourceplanner/resourceplanner.svg";
        readonly dark: "file:../nodes/Resourceplanner/resourceplanner.dark.svg";
    };
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
