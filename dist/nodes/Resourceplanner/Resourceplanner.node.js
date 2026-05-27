"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resourceplanner = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const assignment_1 = require("./resources/assignment");
const project_1 = require("./resources/project");
const resource_1 = require("./resources/resource");
function isDataObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function toDataObject(value) {
    if (isDataObject(value)) {
        return value;
    }
    if (value === null || value === undefined) {
        return {};
    }
    return { value: String(value) };
}
function toDataObjectArray(value) {
    return Array.isArray(value) ? value.map(toDataObject) : [toDataObject(value)];
}
function getCollectionParameter(context, name, itemIndex) {
    return context.getNodeParameter(name, itemIndex, {});
}
function normalizeWorkDays(value) {
    if (!Array.isArray(value)) {
        return undefined;
    }
    return value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
}
function getJsonField(context, value, fieldName, itemIndex) {
    try {
        return (0, GenericFunctions_1.normalizeJsonInput)(value);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${fieldName} must be valid JSON.`, {
            description: error instanceof Error ? error.message : undefined,
            itemIndex,
        });
    }
}
function applyJsonField(context, body, source, fieldName, itemIndex) {
    const value = getJsonField(context, source[fieldName], fieldName, itemIndex);
    if (value !== undefined) {
        body[fieldName] = value;
    }
}
function getListFromResponse(response, key) {
    const value = response[key];
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map(toDataObject);
}
function extractResponseData(resource, operation, response) {
    var _a;
    if (operation === 'getAll') {
        const key = resource === 'assignment' ? 'assignments' : `${resource}s`;
        return getListFromResponse(response, key);
    }
    if (resource === 'assignment' &&
        operation === 'create' &&
        Array.isArray(response.createdAssignments)) {
        return response.createdAssignments.map(toDataObject);
    }
    if (resource === 'assignment' &&
        operation === 'update' &&
        Array.isArray(response.updatedAssignments)) {
        return response.updatedAssignments.map(toDataObject);
    }
    const data = (_a = response.data) !== null && _a !== void 0 ? _a : response[resource];
    if (Array.isArray(data)) {
        return data.map(toDataObject);
    }
    if (isDataObject(data)) {
        return data;
    }
    return response;
}
function limitResults(context, data, operation, itemIndex) {
    if (operation !== 'getAll') {
        return data;
    }
    const returnAll = context.getNodeParameter('returnAll', itemIndex, false);
    if (returnAll) {
        return data;
    }
    const limit = context.getNodeParameter('limit', itemIndex, 50);
    return data.slice(0, limit);
}
async function executeProjectOperation(operation, itemIndex) {
    if (operation === 'getAll') {
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', '/api/projects');
    }
    if (operation === 'get') {
        const projectId = this.getNodeParameter('projectId', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', `/api/projects/${projectId}`);
    }
    if (operation === 'delete') {
        const projectId = this.getNodeParameter('projectId', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'DELETE', `/api/projects/${projectId}`);
    }
    if (operation === 'create') {
        const title = this.getNodeParameter('title', itemIndex);
        const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
        const body = {
            title,
            color: additionalFields.color,
            hidden: additionalFields.hidden,
            note: additionalFields.note,
            probability: additionalFields.probability,
            projectRate: additionalFields.projectRate,
            projectSize: additionalFields.projectSize,
        };
        applyJsonField(this, body, additionalFields, 'resourceRates', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'POST', '/api/projects', body);
    }
    if (operation === 'update') {
        const projectId = this.getNodeParameter('projectId', itemIndex);
        const title = this.getNodeParameter('title', itemIndex);
        const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
        const body = {
            title,
            color: updateFields.color,
            hidden: updateFields.hidden,
            note: updateFields.note,
            probability: updateFields.probability,
            projectRate: updateFields.projectRate,
            projectSize: updateFields.projectSize,
        };
        applyJsonField(this, body, updateFields, 'resourceRates', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'PUT', `/api/projects/${projectId}`, body);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported project operation: ${operation}`, {
        itemIndex,
    });
}
async function executeResourceOperation(operation, itemIndex) {
    if (operation === 'getAll') {
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', '/api/resources');
    }
    if (operation === 'get') {
        const resourceId = this.getNodeParameter('resourceId', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', `/api/resources/${resourceId}`);
    }
    if (operation === 'delete') {
        const resourceId = this.getNodeParameter('resourceId', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'DELETE', `/api/resources/${resourceId}`);
    }
    if (operation === 'create') {
        const name = this.getNodeParameter('name', itemIndex);
        const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
        const body = {
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
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'POST', '/api/resources', body);
    }
    if (operation === 'update') {
        const resourceId = this.getNodeParameter('resourceId', itemIndex);
        const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
        const body = {
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
        if (Object.keys((0, GenericFunctions_1.compactObject)(body)).length === 0) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one update field must be set.', {
                itemIndex,
            });
        }
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'PUT', `/api/resources/${resourceId}`, body);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource operation: ${operation}`, {
        itemIndex,
    });
}
async function executeAssignmentOperation(operation, itemIndex) {
    if (operation === 'getAll') {
        const filters = getCollectionParameter(this, 'filters', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', '/api/assignments', {}, filters);
    }
    if (operation === 'delete') {
        const assignmentId = this.getNodeParameter('assignmentId', itemIndex);
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'DELETE', `/api/assignments/${assignmentId}`);
    }
    if (operation === 'create') {
        const projectId = this.getNodeParameter('projectId', itemIndex);
        const resourceId = this.getNodeParameter('resourceId', itemIndex);
        const dateFrom = this.getNodeParameter('dateFrom', itemIndex);
        const dateTo = this.getNodeParameter('dateTo', itemIndex);
        const additionalFields = getCollectionParameter(this, 'additionalFields', itemIndex);
        const body = {
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
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'POST', '/api/assignments', body);
    }
    if (operation === 'update') {
        const assignmentId = this.getNodeParameter('assignmentId', itemIndex);
        const updateFields = getCollectionParameter(this, 'updateFields', itemIndex);
        const body = {
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
        if (Object.keys((0, GenericFunctions_1.compactObject)(body)).length === 0) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one update field must be set.', {
                itemIndex,
            });
        }
        return GenericFunctions_1.resourcePlannerApiRequest.call(this, 'PUT', `/api/assignments/${assignmentId}`, body);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported assignment operation: ${operation}`, {
        itemIndex,
    });
}
function buildLoadOptions(items, labelKey) {
    var _a, _b, _c;
    if (!Array.isArray(items)) {
        return [];
    }
    const options = [];
    for (const item of items) {
        if (!isDataObject(item)) {
            continue;
        }
        const value = (_a = item.id) !== null && _a !== void 0 ? _a : item._id;
        if (value === undefined || value === null || value === '') {
            continue;
        }
        const label = (_c = (_b = item[labelKey]) !== null && _b !== void 0 ? _b : item.id) !== null && _c !== void 0 ? _c : item._id;
        options.push({
            name: String(label),
            value: String(value),
        });
    }
    return options.sort((a, b) => a.name.localeCompare(b.name));
}
class Resourceplanner {
    constructor() {
        this.methods = {
            loadOptions: {
                async getProjects() {
                    const response = await GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', '/api/projects');
                    return buildLoadOptions(response.projects, 'title');
                },
                async getResources() {
                    const response = await GenericFunctions_1.resourcePlannerApiRequest.call(this, 'GET', '/api/resources');
                    return buildLoadOptions(response.resources, 'name');
                },
            },
        };
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...assignment_1.assignmentDescription,
                ...project_1.projectDescription,
                ...resource_1.resourceDescription,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const resource = this.getNodeParameter('resource', itemIndex);
                const operation = this.getNodeParameter('operation', itemIndex);
                let response;
                if (resource === 'assignment') {
                    response = await executeAssignmentOperation.call(this, operation, itemIndex);
                }
                else if (resource === 'project') {
                    response = await executeProjectOperation.call(this, operation, itemIndex);
                }
                else {
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
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                        },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message, {
                        itemIndex,
                    });
                }
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex });
            }
        }
        return [returnData];
    }
}
exports.Resourceplanner = Resourceplanner;
//# sourceMappingURL=Resourceplanner.node.js.map