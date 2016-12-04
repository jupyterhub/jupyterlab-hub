var buildExtension = require('@jupyterlab/extension-builder').buildExtension;

buildExtension({
        name: 'jupyterhub_labextension',
        entry: './lib/plugin.js',
        outputDir: './jupyterhub_labextension/static'
});
