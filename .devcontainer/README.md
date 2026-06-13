# Dev Container — Better Bhaarat Maps

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine on Linux)
- [VS Code](https://code.visualstudio.com/) with the
  [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Recommended Docker resource allocation

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| CPU      | 2 cores | 4 cores     |
| RAM      | 4 GB    | 8 GB        |
| Disk     | 4 GB    | 10 GB       |

## Getting started

1. Clone the repo and open it in VS Code.
2. When prompted, click **Reopen in Container** — or run
   `Dev Containers: Reopen in Container` from the command palette.
3. Wait for the container to build and `bun install` to complete.
4. Run the dev server: `bun run dev`

## Environment variables

Copy `.env.example` to `.env` at the project root **before** opening the container.  
Never commit `.env` — it is gitignored.
