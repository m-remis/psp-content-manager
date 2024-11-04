import {shell} from "electron";

export const MENU_CONTENT = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    shell.openExternal('https://github.com/m-remis/psp-tool/blob/main/README.md');
                },
            },
        ],
    },
]