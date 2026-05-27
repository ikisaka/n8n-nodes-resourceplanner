# Agent Notes

This file is for AI coding agents and maintainers working on this repository.
It is not end-user documentation and is not included in the npm package.

For user-facing setup, credentials, and workflow examples, update `README.md`.

## Project

This package is an n8n community node for Resource Planner.

- Package name: `n8n-nodes-resourceplanner`
- Node: `Resource Planner`
- Credential type: `Resource Planner API`
- Main node file: `nodes/Resourceplanner/Resourceplanner.node.ts`
- Credential file: `credentials/ResourceplannerApi.credentials.ts`

## Resource Planner API

The node uses the Resource Planner workspace REST API.

Authentication:

- Bearer token in the `Authorization` header.
- The token must be the workspace API access key from Resource Planner Settings > API access for REST clients.
- Do not use embed keys, MCP keys, webhook secrets, or outbound integration API keys.

Base URL:

- Default: `https://resourceplanner.io`
- The node normalizes a trailing `/api`, but the root URL is preferred.

Supported endpoints:

- `GET /api/resources`
- `POST /api/resources`
- `GET /api/resources/:id`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/assignments`
- `POST /api/assignments`
- `PUT /api/assignments/:id`
- `DELETE /api/assignments/:id`

## Development

Use the n8n node CLI commands already defined in `package.json`.

```bash
npm run build
npm run lint
npm pack --dry-run
```

Before publishing or opening a release PR, all three should pass.

## Conventions

- Keep node fields aligned with the current Resource Planner REST API.
- Prefer small, explicit property definitions over broad generic request fields.
- Keep examples and troubleshooting in `README.md`.
- Update `CHANGELOG.md` whenever changing package behavior or version.
- If adding, removing, or renaming node or credential entry points, update the `n8n` section in `package.json`.
- Do not commit secrets, generated API keys, or local n8n credentials.

## Icons

Icons live in:

- `nodes/Resourceplanner/resourceplanner.svg`
- `nodes/Resourceplanner/resourceplanner.dark.svg`

The build copies these to `dist`.

## Generated Output

`dist` is included in the npm package because `package.json` publishes only `dist` plus standard package metadata. Rebuild after code or icon changes.
