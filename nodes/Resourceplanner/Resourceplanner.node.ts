import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type ILoadOptionsFunctions,
	type INodeExecutionData,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import { compactObject, normalizeJsonInput, resourcePlannerApiRequest } from './GenericFunctions';
import { assignmentDescription } from './resources/assignment';
import { projectDescription } from './resources/project';
import { resourceDescription } from './resources/resource';

type ResourcePlannerResource = 'assignment' | 'project' | 'resource';
type ResourcePlannerOperation = 'create' | 'delete' | 'get' | 'getAll' | 'update';

function isDataObject(value: unknown): value is IDataObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toDataObject(value: unknown): IDataObject {
	if (isDataObject(value)) {
		return value;
	}

	if (value === null || value === undefined) {
		return {};
	}

	return { value: String(value) };
}

function toDataObjectArray(value: IDataObject | IDataObject[]): IDataObject[] {
	return Array.isArray(value) ? value.map(toDataObject) : [toDataObject(value)];
}

function getCollectionParameter(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): IDataObject {
	return context.getNodeParameter(name, itemIndex, {}) as IDataObject;
}

function normalizeWorkDays(value: unknown): number[] | undefined {
	if (!Array.isArray(value)) {
		return undefined;
	}

	return value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
}

function getJsonField(
	context: IExecuteFunctions,
	value: unknown,
	fieldName: string,
	itemIndex: number,
): unknown {
	try {
		return normalizeJsonInput(value);
	} catch (error) {
		throw new NodeOperationError(context.getNode(), `${fieldName} must be valid JSON.`, {
			description: error instanceof Error ? error.message : undefined,
			itemIndex,
		});
	}
}

function applyJsonField(
	context: IExecuteFunctions,
	body: IDataObject,
	source: IDataObject,
	fieldName: string,
	itemIndex: number,
): void {
	const value = getJsonField(context, source[fieldName], fieldName, itemIndex);
	if (value !== undefined) {
		body[fieldName] = value as IDataObject;
	}
}

function getListFromResponse(response: IDataObject, key: string): IDataObject[] {
	const value = response[key];
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map(toDataObject);
}

function extractResponseData(
	resource: ResourcePlannerResource,
	operation: ResourcePlannerOperation,
	response: IDataObject,
): IDataObject | IDataObject[] {
	if (operation === 'getAll') {
		const key = resource === 'assignment' ? 'assignments' : `${resource}s`;
		return getListFromResponse(response, key);
	}

	if (
		resource === 'assignment' &&
		operation === 'create' &&
		Array.isArray(response.createdAssignments)
	) {
		return response.createdAssignments.map(toDataObject);
	}

	if (
		resource === 'assignment' &&
		operation === 'update' &&
		Array.isArray(response.updatedAssignments)
	) {
		return response.updatedAssignments.map(toDataObject);
	}

	const data = response.data ?? response[resource];

	if (Array.isArray(data)) {
		return data.map(toDataObject);
	}

	if (isDataObject(data)) {
		return data;
	}

	return response;
}

function limitResults(
	context: IExecuteFunctions,
	data: IDataObject[],
	operation: ResourcePlannerOperation,
	itemIndex: number,
): IDataObject[] {
	if (operation !== 'getAll') {
		return data;
	}

	const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
	if (returnAll) {
		return data;
	}

	const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
	return data.slice(0, limit);
}

async function executeProjectOperation(
	this: IExecuteFunctions,
	operation: ResourcePlannerOperation,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		return resourcePlannerApiRequest.call(this, 'GET', '/api/projects');
	}

	if (operation === 'get') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		return resourcePlannerApiRequest.call(this, 'GET', `/api/projects/${projectId}`);
	}

	if (operation === 'delete') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		return resourcePlannerApiRequest.call(this, 'DELETE', `/api/projects/${projectId}`);
	}

	if (operation === 'create') {
		const title = this.getNodeParameter('title', itemIndex) as string;
		const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
		const body: IDataObject = {
			title,
			color: additionalFields.color,
			hidden: additionalFields.hidden,
			note: additionalFields.note,
			probability: additionalFields.probability,
			projectRate: additionalFields.projectRate,
			projectSize: additionalFields.projectSize,
		};
		applyJsonField(this, body, additionalFields, 'resourceRates', itemIndex);

		return resourcePlannerApiRequest.call(this, 'POST', '/api/projects', body);
	}

	if (operation === 'update') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		const title = this.getNodeParameter('title', itemIndex) as string;
		const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
		const body: IDataObject = {
			title,
			color: updateFields.color,
			hidden: updateFields.hidden,
			note: updateFields.note,
			probability: updateFields.probability,
			projectRate: updateFields.projectRate,
			projectSize: updateFields.projectSize,
		};
		applyJsonField(this, body, updateFields, 'resourceRates', itemIndex);

		return resourcePlannerApiRequest.call(this, 'PUT', `/api/projects/${projectId}`, body);
	}

	throw new NodeOperationError(this.getNode(), `Unsupported project operation: ${operation}`, {
		itemIndex,
	});
}

async function executeResourceOperation(
	this: IExecuteFunctions,
	operation: ResourcePlannerOperation,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		return resourcePlannerApiRequest.call(this, 'GET', '/api/resources');
	}

	if (operation === 'get') {
		const resourceId = this.getNodeParameter('resourceId', itemIndex) as string;
		return resourcePlannerApiRequest.call(this, 'GET', `/api/resources/${resourceId}`);
	}

	if (operation === 'delete') {
		const resourceId = this.getNodeParameter('resourceId', itemIndex) as string;
		return resourcePlannerApiRequest.call(this, 'DELETE', `/api/resources/${resourceId}`);
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
		const body: IDataObject = {
			name,
			capacity: additionalFields.capacity,
			email: additionalFields.email,
			hidden: additionalFields.hidden,
			hourlyExpense: additionalFields.hourlyExpense,
			invited: additionalFields.invited,
			note: additionalFields.note,
			workDays: normalizeWorkDays(additionalFields.workDays),
		};
		applyJsonField(this, body, additionalFields, 'membership', itemIndex);

		return resourcePlannerApiRequest.call(this, 'POST', '/api/resources', body);
	}

	if (operation === 'update') {
		const resourceId = this.getNodeParameter('resourceId', itemIndex) as string;
		const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
		const body: IDataObject = {
			capacity: updateFields.capacity,
			email: updateFields.email,
			hidden: updateFields.hidden,
			hourlyExpense: updateFields.hourlyExpense,
			invited: updateFields.invited,
			name: updateFields.name,
			note: updateFields.note,
			workDays: normalizeWorkDays(updateFields.workDays),
		};
		applyJsonField(this, body, updateFields, 'membership', itemIndex);

		if (Object.keys(compactObject(body)).length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one update field must be set.', {
				itemIndex,
			});
		}

		return resourcePlannerApiRequest.call(this, 'PUT', `/api/resources/${resourceId}`, body);
	}

	throw new NodeOperationError(this.getNode(), `Unsupported resource operation: ${operation}`, {
		itemIndex,
	});
}

async function executeAssignmentOperation(
	this: IExecuteFunctions,
	operation: ResourcePlannerOperation,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const filters = getCollectionParameter(this, 'filters', itemIndex);
		return resourcePlannerApiRequest.call(this, 'GET', '/api/assignments', {}, filters);
	}

	if (operation === 'delete') {
		const assignmentId = this.getNodeParameter('assignmentId', itemIndex) as string;
		return resourcePlannerApiRequest.call(this, 'DELETE', `/api/assignments/${assignmentId}`);
	}

	if (operation === 'create') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		const resourceId = this.getNodeParameter('resourceId', itemIndex) as string;
		const dateFrom = this.getNodeParameter('dateFrom', itemIndex) as string;
		const dateTo = this.getNodeParameter('dateTo', itemIndex) as string;
		const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
		const body: IDataObject = {
			project: projectId,
			resource: resourceId,
			dateFrom,
			dateTo,
			description: additionalFields.description,
			hoursPerDay: additionalFields.hoursPerDay,
			note: additionalFields.note,
			repeatWeekly: additionalFields.repeatWeekly,
			repeatWeeks: additionalFields.repeatWeeks,
			title: additionalFields.title,
		};
		applyJsonField(this, body, additionalFields, 'comments', itemIndex);
		applyJsonField(this, body, additionalFields, 'timeOff', itemIndex);

		return resourcePlannerApiRequest.call(this, 'POST', '/api/assignments', body);
	}

	if (operation === 'update') {
		const assignmentId = this.getNodeParameter('assignmentId', itemIndex) as string;
		const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
		const body: IDataObject = {
			dateFrom: updateFields.dateFrom,
			dateTo: updateFields.dateTo,
			description: updateFields.description,
			hoursPerDay: updateFields.hoursPerDay,
			note: updateFields.note,
			projectId: updateFields.projectId,
			repeatWeekly: updateFields.repeatWeekly,
			repeatWeeks: updateFields.repeatWeeks,
			resourceId: updateFields.resourceId,
			seriesEditMode: updateFields.seriesEditMode,
			timeOffAction: updateFields.timeOffAction,
			title: updateFields.title,
		};
		applyJsonField(this, body, updateFields, 'comments', itemIndex);

		if (Object.keys(compactObject(body)).length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one update field must be set.', {
				itemIndex,
			});
		}

		return resourcePlannerApiRequest.call(this, 'PUT', `/api/assignments/${assignmentId}`, body);
	}

	throw new NodeOperationError(this.getNode(), `Unsupported assignment operation: ${operation}`, {
		itemIndex,
	});
}

function buildLoadOptions(items: unknown, labelKey: 'name' | 'title'): INodePropertyOptions[] {
	if (!Array.isArray(items)) {
		return [];
	}

	const options: INodePropertyOptions[] = [];

	for (const item of items) {
		if (!isDataObject(item)) {
			continue;
		}

		const value = item.id ?? item._id;
		if (value === undefined || value === null || value === '') {
			continue;
		}

		const label = item[labelKey] ?? item.id ?? item._id;
		options.push({
			name: String(label),
			value: String(value),
		});
	}

	return options.sort((a, b) => a.name.localeCompare(b.name));
}

export class Resourceplanner implements INodeType {
	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await resourcePlannerApiRequest.call(this, 'GET', '/api/projects');
				return buildLoadOptions(response.projects, 'title');
			},
			async getResources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await resourcePlannerApiRequest.call(this, 'GET', '/api/resources');
				return buildLoadOptions(response.resources, 'name');
			},
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Resource Planner',
		name: 'resourceplanner',
		icon: { light: 'file:resourceplanner.svg', dark: 'file:resourceplanner.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Resource Planner API',
		defaults: {
			name: 'Resource Planner',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'resourceplannerApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Assignment',
						value: 'assignment',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Resource',
						value: 'resource',
					},
				],
				default: 'project',
			},
			...assignmentDescription,
			...projectDescription,
			...resourceDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter(
					'resource',
					itemIndex,
				) as ResourcePlannerResource;
				const operation = this.getNodeParameter(
					'operation',
					itemIndex,
				) as ResourcePlannerOperation;

				let response: IDataObject | IDataObject[];
				if (resource === 'assignment') {
					response = await executeAssignmentOperation.call(this, operation, itemIndex);
				} else if (resource === 'project') {
					response = await executeProjectOperation.call(this, operation, itemIndex);
				} else {
					response = await executeResourceOperation.call(this, operation, itemIndex);
				}

				const extractedData = Array.isArray(response)
					? response
					: extractResponseData(resource, operation, response);
				const outputData = limitResults(this, toDataObjectArray(extractedData), operation, itemIndex);
				const executionData = this.helpers.returnJsonArray(outputData);
				executionData.forEach((entry) => {
					entry.pairedItem = { item: itemIndex };
				});
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw new NodeOperationError(this.getNode(), error.message, {
						itemIndex,
					});
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
