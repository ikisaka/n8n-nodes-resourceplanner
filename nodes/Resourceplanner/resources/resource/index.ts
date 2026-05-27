import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResources = {
	resource: ['resource'],
};

const showOnlyForResourceCreate = {
	operation: ['create'],
	resource: ['resource'],
};

const showOnlyForResourceGetMany = {
	operation: ['getAll'],
	resource: ['resource'],
};

const showOnlyForResourceUpdate = {
	operation: ['update'],
	resource: ['resource'],
};

const workDayOptions = [
	{
		name: 'Friday',
		value: 5,
	},
	{
		name: 'Monday',
		value: 1,
	},
	{
		name: 'Saturday',
		value: 6,
	},
	{
		name: 'Sunday',
		value: 7,
	},
	{
		name: 'Thursday',
		value: 4,
	},
	{
		name: 'Tuesday',
		value: 2,
	},
	{
		name: 'Wednesday',
		value: 3,
	},
];

const resourceAdditionalFields: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: showOnlyForResourceCreate,
	},
	options: [
		{
			displayName: 'Capacity',
			name: 'capacity',
			type: 'number',
			default: 40,
			description: 'Weekly capacity in hours',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'name@email.com',
			description: 'Resource email address',
		},
		{
			displayName: 'Hidden',
			name: 'hidden',
			type: 'boolean',
			default: false,
			description: 'Whether the resource is hidden from regular planning views',
		},
		{
			displayName: 'Hourly Expense',
			name: 'hourlyExpense',
			type: 'number',
			default: 0,
			description: 'Hourly cost for the resource',
		},
		{
			displayName: 'Invited',
			name: 'invited',
			type: 'boolean',
			default: false,
			description: 'Whether to invite this resource to the workspace',
		},
		{
			displayName: 'Membership',
			name: 'membership',
			type: 'json',
			default: '',
			description: 'JSON membership payload for invited users or access settings',
		},
		{
			displayName: 'Note',
			name: 'note',
			type: 'string',
			typeOptions: {
				rows: 4,
			},
			default: '',
			description: 'Internal notes for the resource',
		},
		{
			displayName: 'Work Days',
			name: 'workDays',
			type: 'multiOptions',
			options: workDayOptions,
			default: [],
			description: 'Working days for this resource',
		},
	],
};

const resourceUpdateFields: INodeProperties = {
	displayName: 'Update Fields',
	name: 'updateFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: showOnlyForResourceUpdate,
	},
	options: [
		{
			displayName: 'Capacity',
			name: 'capacity',
			type: 'number',
			default: 40,
			description: 'Weekly capacity in hours',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'name@email.com',
			description: 'Resource email address',
		},
		{
			displayName: 'Hidden',
			name: 'hidden',
			type: 'boolean',
			default: false,
			description: 'Whether the resource is hidden from regular planning views',
		},
		{
			displayName: 'Hourly Expense',
			name: 'hourlyExpense',
			type: 'number',
			default: 0,
			description: 'Hourly cost for the resource',
		},
		{
			displayName: 'Invited',
			name: 'invited',
			type: 'boolean',
			default: false,
			description: 'Whether to invite this resource to the workspace',
		},
		{
			displayName: 'Membership',
			name: 'membership',
			type: 'json',
			default: '',
			description: 'JSON membership payload for invited users or access settings',
		},
		{
			displayName: 'Name',
			name: 'name',
			type: 'string',
			default: '',
			description: 'Resource name',
		},
		{
			displayName: 'Note',
			name: 'note',
			type: 'string',
			typeOptions: {
				rows: 4,
			},
			default: '',
			description: 'Internal notes for the resource',
		},
		{
			displayName: 'Work Days',
			name: 'workDays',
			type: 'multiOptions',
			options: workDayOptions,
			default: [],
			description: 'Working days for this resource',
		},
	],
};

export const resourceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForResources,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a resource',
				description: 'Create a resource',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a resource',
				description: 'Delete a resource',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a resource',
				description: 'Get a resource',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many resources',
				description: 'Get many resources',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a resource',
				description: 'Update a resource',
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['delete', 'get', 'update'],
				resource: ['resource'],
			},
		},
		default: '',
		description: 'The ID of the resource',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForResourceGetMany,
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
				...showOnlyForResourceGetMany,
				returnAll: [false],
			},
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForResourceCreate,
		},
		default: '',
		description: 'Resource name',
	},
	resourceAdditionalFields,
	resourceUpdateFields,
];
