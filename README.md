# jupyterlab-hub

** This repo has been deprecated.  The equivalent functionality is now
available in JupyterLab itself.
Any functionality that might have been added here should go in https://github.com/jupyterlab/jupyterlab/tree/master/packages/hub-extension
**

[JupyterLab](https://github.com/jupyterlab/jupyterlab) integration for
[JupyterHub](https://github.com/jupyterhub/jupyterhub).

This adds a "Hub" menu to JupyterLab that allows a user to log out of JupyterHub
or access their JupyterHub control panel. This follows the JupyterLab extension system where an extension is just an npm package, not wrapped
in a Python package.

## Prerequisites

* JupyterLab.
* A properly configured JupyterHub.

## Installation

### Setup user environment

To install the extension, run:

```bash
jupyter labextension install @jupyterlab/hub-extension
```

Note that if JupyterHub is served under a sub-directory (for instance `/jupyter`), you will need to pass this information to JupyterLab via `page_config.json`. In an Anaconda installation, this file should be created at `/path/to/anaconda/share/jupyter/lab/settings/page_config.json`.

Example contents of `page_config.json`:
```json
{
    "hub_prefix": "/jupyter"
}
```

### Configure JupyterHub's Spawner to start JupyterLab

Configure JupyterHub's Spawner to start with a JupyterLab that is aware of the JupyterHub by using a `jupyterhub_config.py` with the following entry:

```
c.Spawner.cmd = ['jupyter-labhub']
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
