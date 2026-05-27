"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentDescription = void 0;
const showOnlyForAssignments = {
    resource: ['assignment'],
};
const showOnlyForAssignmentCreate = {
    operation: ['create'],
    resource: ['assignment'],
};
const showOnlyForAssignmentGetMany = {
    operation: ['getAll'],
    resource: ['assignment'],
};
const showOnlyForAssignmentUpdate = {
    operation: ['update'],
    resource: ['assignment'],
};
const assignmentAdditionalFields = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: showOnlyForAssignmentCreate,
    },
    options: [
        {
            displayName: 'Comments',
            name: 'comments',
            type: 'json',
            default: '',
            description: 'JSON array of task comments',
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Task description, can contain HTML',
        },
        {
            displayName: 'Hours Per Day',
            name: 'hoursPerDay',
            type: 'number',
            default: 0,
            description: 'Assigned hours per day',
        },
        {
            displayName: 'Note',
            name: 'note',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Assignment note',
        },
        {
            displayName: 'Repeat Weekly',
            name: 'repeatWeekly',
            type: 'boolean',
            default: false,
            description: 'Whether to create a weekly recurring series',
        },
        {
            displayName: 'Repeat Weeks',
            name: 'repeatWeeks',
            type: 'number',
            typeOptions: {
                minValue: 1,
            },
            default: 1,
            description: 'Number of weekly occurrences to create',
        },
        {
            displayName: 'Task Title',
            name: 'title',
            type: 'string',
            default: '',
            description: 'Optional linked task title',
        },
        {
            displayName: 'Time Off',
            name: 'timeOff',
            type: 'json',
            default: '',
            description: 'JSON Time Off payload for Time Off assignments',
        },
    ],
};
const assignmentFilters = {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
        show: showOnlyForAssignmentGetMany,
    },
    options: [
        {
            displayName: 'Date From',
            name: 'dateFrom',
            type: 'dateTime',
            default: '',
            description: 'Only return assignments overlapping on or after this date',
        },
        {
            displayName: 'Date To',
            name: 'dateTo',
            type: 'dateTime',
            default: '',
            description: 'Only return assignments overlapping on or before this date',
        },
        {
            displayName: 'Project Name or ID',
            name: 'projectId',
            type: 'options',
            typeOptions: {
                loadOptionsMethod: 'getProjects',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        },
        {
            displayName: 'Resource Name or ID',
            name: 'resourceId',
            type: 'options',
            typeOptions: {
                loadOptionsMethod: 'getResources',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        },
    ],
};
const assignmentUpdateFields = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: showOnlyForAssignmentUpdate,
    },
    options: [
        {
            displayName: 'Comments',
            name: 'comments',
            type: 'json',
            default: '',
            description: 'JSON array of task comments',
        },
        {
            displayName: 'Date From',
            name: 'dateFrom',
            type: 'dateTime',
            default: '',
            description: 'Assignment start date',
        },
        {
            displayName: 'Date To',
            name: 'dateTo',
            type: 'dateTime',
            default: '',
            description: 'Assignment end date',
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Task description, can contain HTML',
        },
        {
            displayName: 'Hours Per Day',
            name: 'hoursPerDay',
            type: 'number',
            default: 0,
            description: 'Assigned hours per day',
        },
        {
            displayName: 'Note',
            name: 'note',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Assignment note',
        },
        {
            displayName: 'Project Name or ID',
            name: 'projectId',
            type: 'options',
            typeOptions: {
                loadOptionsMethod: 'getProjects',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        },
        {
            displayName: 'Repeat Weekly',
            name: 'repeatWeekly',
            type: 'boolean',
            default: false,
            description: 'Whether this assignment should be weekly recurring',
        },
        {
            displayName: 'Repeat Weeks',
            name: 'repeatWeeks',
            type: 'number',
            typeOptions: {
                minValue: 0,
            },
            default: 0,
            description: 'Number of weekly occurrences in the recurring series',
        },
        {
            displayName: 'Resource Name or ID',
            name: 'resourceId',
            type: 'options',
            typeOptions: {
                loadOptionsMethod: 'getResources',
            },
            default: '',
            description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        },
        {
            displayName: 'Series Edit Mode',
            name: 'seriesEditMode',
            type: 'options',
            options: [
                {
                    name: 'Future Assignments',
                    value: 'future',
                },
                {
                    name: 'Single Assignment',
                    value: 'single',
                },
            ],
            default: 'single',
            description: 'How to apply updates to recurring assignments',
        },
        {
            displayName: 'Task Title',
            name: 'title',
            type: 'string',
            default: '',
            description: 'Optional linked task title',
        },
        {
            displayName: 'Time Off Action',
            name: 'timeOffAction',
            type: 'options',
            options: [
                {
                    name: 'Approve',
                    value: 'approve',
                },
            ],
            default: 'approve',
            description: 'Action to apply to a Time Off assignment',
        },
    ],
};
exports.assignmentDescription = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAssignments,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create an assignment',
                description: 'Create an assignment',
            },
            {
                name: 'Delete',
                value: 'delete',
                action: 'Delete an assignment',
                description: 'Delete an assignment',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                action: 'Get many assignments',
                description: 'Get many assignments',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update an assignment',
                description: 'Update an assignment',
            },
        ],
        default: 'getAll',
    },
    {
        displayName: 'Assignment ID',
        name: 'assignmentId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                operation: ['delete', 'update'],
                resource: ['assignment'],
            },
        },
        default: '',
        description: 'The ID of the assignment',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: showOnlyForAssignmentGetMany,
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
                ...showOnlyForAssignmentGetMany,
                returnAll: [false],
            },
        },
        default: 50,
        description: 'Max number of results to return',
    },
    assignmentFilters,
    {
        displayName: 'Project Name or ID',
        name: 'projectId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getProjects',
        },
        displayOptions: {
            show: showOnlyForAssignmentCreate,
        },
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    },
    {
        displayName: 'Resource Name or ID',
        name: 'resourceId',
        type: 'options',
        required: true,
        typeOptions: {
            loadOptionsMethod: 'getResources',
        },
        displayOptions: {
            show: showOnlyForAssignmentCreate,
        },
        default: '',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    },
    {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'dateTime',
        required: true,
        displayOptions: {
            show: showOnlyForAssignmentCreate,
        },
        default: '',
        description: 'Assignment start date',
    },
    {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'dateTime',
        required: true,
        displayOptions: {
            show: showOnlyForAssignmentCreate,
        },
        default: '',
        description: 'Assignment end date',
    },
    assignmentAdditionalFields,
    assignmentUpdateFields,
];
//# sourceMappingURL=index.js.map