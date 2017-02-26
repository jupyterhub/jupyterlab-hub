// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Menu
} from '@phosphor/widgets';

import {
  utils
} from '@jupyterlab/services/lib';

import {
  ICommandPalette
} from 'jupyterlab/lib/commandpalette';

import {
  IMainMenu
} from 'jupyterlab/lib/mainmenu';

import {
  JupyterLab, JupyterLabPlugin
} from 'jupyterlab/lib/application';

import {
  CommandIDs
} from './';


import * as urljoin
  from 'url-join';


/**
 * Activate the jupyterhub extension.
 */
function activateHubExtension(app: JupyterLab, palette: ICommandPalette, mainMenu: IMainMenu): void {

  const category = 'Hub';
  let { commands } = app;

  // This config is provided by JupyterHub to the single-user server app.
  // The app passes in jinja template variables which populate lab.html.
  let hubHost = utils.getConfigOption('hubHost');
  let hubPrefix = utils.getConfigOption('hubPrefix');

  if (!hubPrefix) {
    console.log('jupyterhub-labextension: No configuration found.');
    return
  }

  console.log('jupyterhub-labextension: Found configuration ',
              {hubHost: hubHost, hubPrefix: hubPrefix});

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
