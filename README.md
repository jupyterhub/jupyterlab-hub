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

Alternatively, you can add the following to `jupyterhub_config.py`:

```
c.Spawner.cmd = ['jupyter-labhub']
```

Note: Additional information may be found in the [Zero to JupyterHub Guide for Kubernetes](https://zero-to-jupyterhub.readthedocs.io/en/latest/user-environment.html#use-jupyterlab-by-default)

If Jupyterhub is served under a subdirectory (for instance `/jupyter`), you will need to pass this information to JupyterLab via `page_config.json`. In an Anaconda installation, this file should be created at `/path/to/anaconda/share/jupyter/lab/settings/page_config.json`. Example contents:
```
{
    "hub_prefix": "/jupyter"
}
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


