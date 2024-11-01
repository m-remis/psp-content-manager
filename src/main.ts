import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import {promises as fs} from 'fs';
import path from 'path';
import {FOLDER_STRUCTURE, MIN_HEIGHT, MIN_WIDTH} from "./constants";

if (!app.requestSingleInstanceLock()) {
    console.debug("already running")
    app.quit();
}

let mainWindow: BrowserWindow | null;

function createWindow() {
    console.debug("create window")
    mainWindow = new BrowserWindow({
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

    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

    // Handle the close event
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Focus on the main window if it exists
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

ipcMain.handle('dialog:openFile', async () => {
    console.debug("dialog open file")
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], // Changed to openDirectory for USB drives
        filters: [
            {name: 'All Files', extensions: ['*']},
        ],
    });

    return result.filePaths[0] || null;
});

ipcMain.handle('folder:create', async (_event, directoryPath: string) => {
    await createFolderStructure(directoryPath);
    return `Folder structure created at: ${directoryPath}`;
});

ipcMain.handle('folder:isEmpty', async (_event, directoryPath: string): Promise<boolean> => {
    try {
        const files = await fs.readdir(directoryPath);
        return files.length === 0; // Returns true if empty, false if not
    } catch (error) {
        console.debug('Error checking if directory is empty:', error);
        throw new Error('Could not check directory contents.');
    }
});

async function createFolderStructure(basePath: string) {
    try {
        for (const folder of FOLDER_STRUCTURE) {
            const folderPath = path.join(basePath, folder);
            await fs.mkdir(folderPath, {recursive: true});
        }
        console.debug('Folder structure created successfully.');
    } catch (error) {
        console.error('Error creating folder structure:', error);
        throw new Error('Failed to create folder structure');
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    console.debug("closing all windows")
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    console.debug("activate")
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});