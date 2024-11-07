import {shell} from "electron";

export const INSTANCE_WINDOW_MIN_WIDTH = 1100;
export const INSTANCE_WINDOW_MIN_HEIGHT = 545;

export const MENU_CONTENT = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    openUrlInDefaultBrowser('https://github.com/m-remis/psp-tool/blob/main/README.md');
                },
            },
            {
                label: 'User manual',
                click: () => {
                    openUrlInDefaultBrowser('https://github.com/m-remis/psp-tool/blob/main/docs/USER_MANUAL.md');
                },
            }
        ],
    },
]

function openUrlInDefaultBrowser(url: string) {
    console.debug(`Opening ${url} in default browser`);
    shell.openExternal(url).then(r => console.debug(`Opened: ${url}`));
}