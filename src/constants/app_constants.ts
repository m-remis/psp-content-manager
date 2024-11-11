import {shell} from "electron";

export const INSTANCE_WINDOW_MIN_WIDTH = 1100;
export const INSTANCE_WINDOW_MIN_HEIGHT = 545;

export const githubArk4ReleaseApiUrl = "https://api.github.com/repos/PSP-Archive/ARK-4/releases/latest";
export const githubChronoSwitchReleaseApiUrl = "https://api.github.com/repos/krazynez/Chronoswitch/releases/latest";

export const aboutUrl = "https://github.com/m-remis/psp-tool/blob/main/README.md";
export const userManualUrl = "https://github.com/m-remis/psp-tool/blob/main/docs/USER_MANUAL.md";

export const MENU_CONTENT = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    openUrlInDefaultBrowser(aboutUrl);
                },
            },
            {
                label: 'User manual',
                click: () => {
                    openUrlInDefaultBrowser(userManualUrl);
                },
            }
        ],
    },
]

function openUrlInDefaultBrowser(url: string) {
    console.debug(`Opening ${url} in default browser`);
    shell.openExternal(url).then(r => console.debug(`Opened: ${url}`));
}