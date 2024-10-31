import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

const MIN_WIDTH = 1200;
const MIN_HEIGHT = 600;

function createWindow() {
    console.log("create window")
    const win = new BrowserWindow({
        width: MIN_WIDTH,
        height: MIN_HEIGHT,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../dist/preload.js')
        },
    });

    win.setMenu(null);
    win.loadFile(path.join(__dirname, '../src/index.html'));
}

ipcMain.handle('dialog:openFile', async () => {
    console.log("dialog open file")
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], // Changed to openDirectory for USB drives
        filters: [
            { name: 'All Files', extensions: ['*'] },
        ],
    });

    return result.filePaths[0] || null;
});

ipcMain.handle('folder:create', async (_event, directoryPath: string, folderName: string) => {
    const folderPath = path.join(directoryPath, folderName);
    await fs.promises.mkdir(folderPath, { recursive: true });
    return folderPath;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    console.log("closing all windows")
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    console.log("activate")
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});