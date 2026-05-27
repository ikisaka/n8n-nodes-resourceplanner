# n8n-nodes-resourceplanner

This is an n8n community node for Resource Planner. It lets you automate Resource Planner projects, resources, and assignments from n8n workflows.

Resource Planner is a workspace planning tool for managing project demand, team capacity, and scheduled assignments.

[n8n](https://n8n.io/) is a workflow automation platform.

## Installation

Install this package on a self-hosted n8n instance from npm:

```bash
npm install n8n-nodes-resourceplanner
```

You can also install it from the n8n UI:

1. Open n8n.
2. Go to Settings > Community Nodes.
3. Select Install.
4. Enter `n8n-nodes-resourceplanner`.
5. Restart n8n if your deployment requires it.

Unverified community nodes are available for self-hosted n8n. n8n Cloud requires the node to be submitted and accepted as a verified community node.

## Credentials

This node uses a Resource Planner workspace API access key.

To create one:

1. Sign in to Resource Planner.
2. Open Settings.
3. Go to API access for REST clients.
4. Generate a new API access key.
5. Copy the value immediately. Resource Planner does not show the plaintext key again.

In n8n, create a **Resource Planner API** credential:

| Field | Value |
| --- | --- |
| Base URL | `https://resourceplanner.io` |
| API Access Key | The workspace API access key generated in Resource Planner |

Use the workspace API access key for REST clients. Do not use an embed key, MCP key, webhook secret, or outbound integration API key.

## Operations

### Assignment

| Operation | Description |
| --- | --- |
| Create | Create an assignment for a project and resource |
| Delete | Delete an assignment |
| Get Many | List assignments, optionally filtered by project, resource, and date range |
| Update | Update assignment dates, hours, note, task fields, project, resource, recurrence, or Time Off action |

### Project

| Operation | Description |
| --- | --- |
| Create | Create a project |
| Delete | Delete a project |
| Get | Retrieve a project by ID |
| Get Many | List projects |
| Update | Update a project |

### Resource

| Operation | Description |
| --- | --- |
| Create | Create a resource |
| Delete | Delete a resource |
| Get | Retrieve a resource by ID |
| Get Many | List resources |
| Update | Update a resource |

## Example Workflows

### Test the connection

Use this first after installing the node:

1. Add a Manual Trigger.
2. Add Resource Planner.
3. Set Resource to `Project`.
4. Set Operation to `Get Many`.
5. Set Return All to `false`.
6. Set Limit to `10`.
7. Execute the workflow.

If credentials are valid, the node returns up to 10 projects from your workspace.

### Create a test resource

1. Add a Manual Trigger.
2. Add Resource Planner.
3. Set Resource to `Resource`.
4. Set Operation to `Create`.
5. Set Name to `n8n Test Resource`.
6. Add optional fields such as Capacity and Work Days.
7. Execute the workflow.

Delete the test resource from Resource Planner or by using the Resource Planner node's Resource > Delete operation.

### Daily assignment digest

1. Add a Schedule Trigger.
2. Add Resource Planner.
3. Set Resource to `Assignment`.
4. Set Operation to `Get Many`.
5. Add Date From and Date To filters for the day you want to report.
6. Send the resulting assignments to Slack, email, Notion, or another n8n node.

## Notes

- Assignment project and resource fields load options from Resource Planner when credentials are configured.
- JSON fields such as `comments`, `membership`, `resourceRates`, and `timeOff` must be valid JSON.
- The Base URL should normally be `https://resourceplanner.io`. The node also tolerates `https://resourceplanner.io/api`, but the root URL is recommended.
- Some fields require a Resource Planner Pro workspace or sufficient workspace permissions.

## Troubleshooting

### Couldn't connect with these settings

Check:

- The Base URL is `https://resourceplanner.io`.
- The API Access Key is the workspace REST API access key.
- The workspace has API access enabled.
- The workspace has an active license if API access requires one.

### 401 Unauthorized

The API key is missing, revoked, copied incorrectly, or from a different workspace. Generate a new key and update the n8n credential.

### 403 Forbidden

The key is valid, but Resource Planner refused the action. Common causes are missing license, insufficient permissions, or trying to access a resource outside the workspace scope.

### Dynamic project or resource lists are empty

Run Project > Get Many and Resource > Get Many first. If those return empty arrays, the workspace has no projects/resources or the API key cannot access them.

## Development

Install dependencies:

```bash
npm install
```

Run the node locally with n8n:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Before publishing, run:

```bash
npm run build
npm run lint
npm pack --dry-run
```

## Resources

- [Resource Planner REST API access guide](https://resourceplanner.io/integration/api-access)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n community node publishing documentation](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)

## Version History

### 0.1.0

- Added Resource Planner credentials using workspace API access keys.
- Added project, resource, and assignment operations.
- Added dynamic project and resource option loading for assignment fields.
