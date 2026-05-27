"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectDescription = void 0;
const showOnlyForProjects = {
    resource: ['project'],
};
const showOnlyForProjectCreate = {
    operation: ['create'],
    resource: ['project'],
};
const showOnlyForProjectGetMany = {
    operation: ['getAll'],
    resource: ['project'],
};
const showOnlyForProjectUpdate = {
    operation: ['update'],
    resource: ['project'],
};
const projectAdditionalFields = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: showOnlyForProjectCreate,
    },
    options: [
        {
            displayName: 'Color',
            name: 'color',
            type: 'color',
            default: '#2563eb',
            description: 'Hex color for the project',
        },
        {
            displayName: 'Hidden',
            name: 'hidden',
            type: 'boolean',
            default: false,
            description: 'Whether the project is hidden from regular planning views',
        },
        {
            displayName: 'Note',
            name: 'note',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Internal notes for the project',
        },
        {
            displayName: 'Probability',
            name: 'probability',
            type: 'options',
            options: [
                {
                    name: 'Confirmed',
                    value: 'confirmed',
                },
                {
                    name: 'High',
                    value: 'high',
                },
                {
                    name: 'Low',
                    value: 'low',
                },
            ],
            default: 'confirmed',
            description: 'Project probability used for planning and forecasting',
        },
        {
            displayName: 'Project Rate',
            name: 'projectRate',
            type: 'number',
            default: 0,
            description: 'Default hourly billing rate for the project',
        },
        {
            displayName: 'Project Size',
            name: 'projectSize',
            type: 'number',
            default: 0,
            description: 'Estimated project size in hours',
        },
        {
            displayName: 'Resource Rates',
            name: 'resourceRates',
            type: 'json',
            default: '',
            description: 'JSON array of per-resource rates, for example [{"resourceId":"...","rate":150}]',
        },
    ],
};
const projectUpdateFields = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: showOnlyForProjectUpdate,
    },
    options: [
        {
            displayName: 'Color',
            name: 'color',
            type: 'color',
            default: '#2563eb',
            description: 'Hex color for the project',
        },
        {
            displayName: 'Hidden',
            name: 'hidden',
            type: 'boolean',
            default: false,
            description: 'Whether the project is hidden from regular planning views',
        },
        {
            displayName: 'Note',
            name: 'note',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Internal notes for the project',
        },
        {
            displayName: 'Probability',
            name: 'probability',
            type: 'options',
            options: [
                {
                    name: 'Confirmed',
                    value: 'confirmed',
                },
                {
                    name: 'High',
                    value: 'high',
                },
                {
                    name: 'Low',
                    value: 'low',
                },
            ],
            default: 'confirmed',
            description: 'Project probability used for planning and forecasting',
        },
        {
            displayName: 'Project Rate',
            name: 'projectRate',
            type: 'number',
            default: 0,
            description: 'Default hourly billing rate for the project',
        },
        {
            displayName: 'Project Size',
            name: 'projectSize',
            type: 'number',
            default: 0,
            description: 'Estimated project size in hours',
        },
        {
            displayName: 'Resource Rates',
            name: 'resourceRates',
            type: 'json',
            default: '',
            description: 'JSON array of per-resource rates, for example [{"resourceId":"...","rate":150}]',
        },
    ],
};
exports.projectDescription = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForProjects,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create a project',
                description: 'Create a project',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete a project',
                description: 'Delete a project',
            },
            {
                name: 'Get',
                value: 'get',
                action: 'Get a project',
                description: 'Get a project',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get many projects',
                description: 'Get many projects',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update a project',
                description: 'Update a project',
            },
        ],
        default: 'getAll',
    },
    {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: ['delete', 'get', 'update'],
                resource: ['project'],
            },
        },
        default: '',
        description: 'The ID of the project',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: showOnlyForProjectGetMany,
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                ...showOnlyForProjectGetMany,
                returnAll: [false],
            },
        },
        default: 50,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: ['create', 'update'],
                resource: ['project'],
            },
        },
        default: '',
        description: 'Project title',
    },
    projectAdditionalFields,
    projectUpdateFields,
];
//# sourceMappingURL=index.js.map