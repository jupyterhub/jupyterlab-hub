// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Menu
} from '@phosphor/widgets';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  Dialog, showDialog
} from '@jupyterlab/apputils';

import {
  PageConfig, URLExt
} from '@jupyterlab/coreutils';

import {
  ServerConnection
} from '@jupyterlab/services';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

/**
 * The command IDs used by the plugin.
 */
export
namespace CommandIDs {
  export
    const controlPanel: string = 'hub:control-panel';

  export
    const logout: string = 'hub:logout';

  export
    const restartServer: string = 'hub:restart-server';
};

const checkInterval: number = 7000;

export class HubExtension {

  protected serverConnectionSettings: ServerConnection.ISettings;
  protected app: JupyterLab;
  protected status: string;
  protected hubHost: string;
  protected hubPrefix: string;
  protected baseUrl: string;
  protected restartUrl: string;

  constructor() {
    this.serverConnectionSettings = ServerConnection.makeSettings();
    this.status = 'ok';

    // This config is provided by JupyterHub to the single-user server app
    // in a dictionary: app.web_app.settings['page_config_data'].
    this.hubHost = PageConfig.getOption('hub_host');
    this.hubPrefix = PageConfig.getOption('hub_prefix');
    this.baseUrl = PageConfig.getOption('baseUrl');

    if (!this.hubPrefix) {
      console.warn('jupyterlab-hub: No configuration found.');
      return;
    }

    console.debug('jupyterlab-hub: Found configuration ',
      {
        hubHost: this.hubHost,
        hubPrefix: this.hubPrefix,
        baseUrl: this.baseUrl,
      }
    );
    // TODO: use /spawn/:user/:name
    // but that requires jupyterhub 1.0
    // and jupyterlab to pass username, servername to PageConfig
    this.restartUrl = this.hubHost + URLExt.join(this.hubPrefix, `spawn?next=${this.hubPrefix}home`);
  }

  activate(app: JupyterLab, palette: ICommandPalette, mainMenu: IMainMenu): void {

    this.app = app;
    const category = 'Hub';

    const { commands } = app;

    commands.addCommand(CommandIDs.controlPanel, {
      label: 'Control Panel',
      caption: 'Open the Hub control panel in a new browser tab',
      execute: () => {
        window.open(this.hubHost + URLExt.join(this.hubPrefix, 'home'), '_blank');
      }
    });

    commands.addCommand(CommandIDs.logout, {
      label: 'Logout',
      caption: 'Log out of the Hub',
      execute: () => {
        window.location.href = this.hubHost + URLExt.join(this.baseUrl, 'logout');
      }
    });

    commands.addCommand(CommandIDs.restartServer, {
      label: 'Restart Server',
      caption: 'Request that the Hub restart this server',
      execute: () => {
        window.open(this.restartUrl, '_blank');
      }
    });

    // Add commands and menu items.
    let menu = new Menu({ commands });
    menu.title.label = category;
    [
      CommandIDs.controlPanel,
      CommandIDs.logout,
      CommandIDs.restartServer,
    ].forEach(command => {
      palette.addItem({ command, category });
      menu.addItem({ command });
    });
    mainMenu.addMenu(menu, { rank: 100 });

    window.setInterval(() => {
      if (document.hidden) {
        // don't poll if the window is not frontmost
        return;
      }
      this.checkStatus();
      // add some randomness to the poll
      // so that each user is on a slightly different interval
    }, checkInterval * (1 + 0.25 * Math.random()));
  }

  checkStatus(): void {
    const { commands } = this.app;
    const url = new URL(
      'api/status',
      this.serverConnectionSettings.baseUrl
    );
    const request = ServerConnection.makeRequest(
      url.toString(),
      {},
      this.serverConnectionSettings
    ).then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      return response.json();
    }
    );
    request.then(
      () => {
        this.status = 'ok';
      },
      reason => {
        if (this.status == 'failed') {
          // avoid repeatedly showing this dialog for a single error
          // until the next successful check
          return;
        }
        this.status = 'failed';
        showDialog({
          title: "Server not running",
          body: `Your server at ${this.baseUrl} is not running.
          You may restart it by clicking the link below,
          or visiting ${this.restartUrl}`,
          buttons: [
            Dialog.okButton({
              label: 'Restart server',
            }),
            Dialog.cancelButton({ label: 'Dismiss' }),
          ]
        }).then(result => result.button.accept ?
          commands.execute(CommandIDs.restartServer) : null);
      }
    );
  }
}

/**
 * Activate the jupyterhub extension.
 */
function activateHubExtension(app: JupyterLab, palette: ICommandPalette, mainMenu: IMainMenu): void {
  let theExtension = new HubExtension();
  theExtension.activate(app, palette, mainMenu);
}

/**
 * Initialization data for the jupyterlab_hub extension.
 */
const hubExtension: JupyterLabPlugin<void> = {
  activate: activateHubExtension,
  id: 'jupyter.extensions.jupyterlab-hub',
  requires: [
    ICommandPalette,
    IMainMenu,
  ],
  autoStart: true,
};

export default hubExtension;
