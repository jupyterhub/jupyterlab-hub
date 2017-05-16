# jupyterlab-hub

JupyterLab integration for JupyterHub.

## Prerequisites

* JupyterLab 0.21.0 or later

## Installation

```bash
jupyter labextension install jupyterlab-hub
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

