// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Menu
} from '@phosphor/widgets';

import {
  ICommandPalette, IMainMenu
} from '@jupyterlab/apputils';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  utils
} from '@jupyterlab/services';

import * as urljoin
  from 'url-join';


/**
 * The command IDs used by the plugin.
 */
export
namespace CommandIDs {
  export
  const controlPanel: string = 'hub:control-panel';

  export
  const logout: string = 'hub:logout';
};


/**
 * Activate the jupyterhub extension.
 */
function activateHubExtension(app: JupyterLab, palette: ICommandPalette, mainMenu: IMainMenu): void {

  // This config is provided by JupyterHub by the single-user server app
  // via in dictionary app.web_app.settings['page_config_data'].
  let hubHost = utils.getConfigOption('hub_host');
  let hubPrefix = utils.getConfigOption('hub_prefix');

  if (!hubPrefix) {
    console.log('jupyterhub-labextension: No configuration found.');
    return
  }

  console.log('jupyterhub-labextension: Found configuration ',
              {hubHost: hubHost, hubPrefix: hubPrefix});

  const category = 'Hub';
  const { commands } = app;

  commands.addCommand(CommandIDs.controlPanel, {
    label: 'Control Panel',
	caption: 'Open a the Hub control panel a new browser tab.',
    execute: () => {
      window.open(hubHost + urljoin(hubPrefix, 'home'), '_blank');
    }
  });

  commands.addCommand(CommandIDs.logout, {
    label: 'Logout',
	caption: 'Log out of the Hub.',
    execute: () => {
      window.open(hubHost + urljoin(hubPrefix, 'logout'), '_blank');
    }
  });

  // Add commands and menu itmes.
  let menu = new Menu({ commands });
  menu.title.label = category;
  [
    CommandIDs.controlPanel,
    CommandIDs.logout,
  ].forEach(command => {
    palette.addItem({ command, category });
    menu.addItem({ command });
  });
  mainMenu.addMenu(menu, {rank: 100});
}


/**
 * Initialization data for the jupyterlab_hub extension.
 */
const hubExtension: JupyterLabPlugin<void> = {
  activate: activateHubExtension,
  id: 'jupyter.extensions.jupyterhub-labextension',
  requires: [
    ICommandPalette,
    IMainMenu,
  ],
  autoStart: true,
}

export default hubExtension;

