# jupyterlab-hub

[JupyterLab](https://github.com/jupyterlab/jupyterlab) integration for
[JupyterHub](https://github.com/jupyterhub/jupyterhub).

This adds a "Hub" menu to JupyterLab that allows a user to log out of JupyterHub
or access their JupyterHub control panel. This follows the JupyterLab extension system where an extension is just an npm package, not wrapped
in a Python package.

## Prerequisites

* JupyterLab.
* A properly configured JupyterHub.

## Installation

To install this extension into JupyterLab, do the following:

```bash
jupyter labextension install @jupyterlab/hub-extension
```

In `jupyterhub_config.py` configure the Spawner to tell the single-user notebook servers to default to Jupyter-Lab:

```
c.Spawner.default_url = '/lab'
```

You will also need to start the single user servers in JupyterHub using the following command (that ships with JupyterLab):

```bash
jupyter labhub
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
jupyter labextension link .
```

To rebuild the package and the JupyterLab app after making changes:

```bash
npm run build
jupyter lab build
```


