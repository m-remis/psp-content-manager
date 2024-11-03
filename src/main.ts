import {app, BrowserWindow, ipcMain, dialog, shell, IpcMainInvokeEvent} from 'electron';
import {promises as fs} from 'fs';
import * as path from 'path';
import {FOLDER_STRUCTURE, folderMap, FolderName, MIN_HEIGHT, MIN_WIDTH} from "./constants";

let mainWindow: BrowserWindow | null;

if (!app.requestSingleInstanceLock()) {
    console.debug("Another instance is already running");
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        console.debug("Second instance detected");
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

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

ipcMain.handle('dialog:openFile', async () => {
    console.debug("Main - dialog open file")
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'], // Changed to openDirectory for USB drives
        filters: [
            {name: 'All Files', extensions: ['*']},
        ],
    });

    return result.filePaths[0] || null;
});

ipcMain.handle('folder:create', async (_event: IpcMainInvokeEvent, directoryPath: string) => {
    console.debug("Main - folder create")
    await createFolderStructure(directoryPath);
    return `Folder structure created at: ${directoryPath}`;
});

ipcMain.handle('folder:isEmpty', async (_event: IpcMainInvokeEvent, directoryPath: string): Promise<boolean> => {
    console.debug("Main - folder is empty")
    try {
        const files = await fs.readdir(directoryPath);
        return files.length === 0; // Returns true if empty, false if not
    } catch (error) {
        console.debug('Error checking if directory is empty:', error);
        throw new Error('Could not check directory contents.');
    }
});

ipcMain.handle('dialog:transferUpdate', async (_event: IpcMainInvokeEvent, directoryPath: string): Promise<string> => {
    console.debug("Main - select and copy update file");

    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'PBP Files', extensions: ['pbp'] },
        ],
    });

    if (result.canceled) {
        console.debug("File selection was canceled");
        return "Cancelled";
    }

    const selectedFilePath = result.filePaths[0];
    console.debug(`Selected file: ${selectedFilePath}`);

    const destinationDir = path.join(directoryPath, 'PSP', 'GAME', 'UPDATE');
    const destinationFilePath = path.join(destinationDir, 'EBOOT.PBP');

    try {
        // Ensure the destination directory exists
        await fs.mkdir(destinationDir, { recursive: true });

        // Copy the selected file to the destination with the new name
        await fs.copyFile(selectedFilePath, destinationFilePath);
        console.debug(`File copied to: ${destinationFilePath}`);
        return destinationFilePath;
    } catch (error) {
        console.error('Error copying file:', error);
        return "Failed to copy file";
    }
});

ipcMain.handle('dialog:openTargetDirectory', async (_event: IpcMainInvokeEvent, directoryPath: string, targetFolder: FolderName) => {
    console.debug("Main - open directory");
    try {
        const fullPath = path.join(directoryPath, folderMap[targetFolder]);
        console.debug(`Opening directory at: ${fullPath}`);

        // Check if the directory exists
        try {
            await fs.stat(fullPath);
        } catch (statError) {
            console.error('Directory does not exist:', fullPath);
            return false; // Directory does not exist
        }

        await shell.openPath(fullPath);
        return true; // Indicate success
    } catch (error) {
        console.error('Error opening directory:', error);
        return false; // Indicate failure
    }
});

async function createFolderStructure(basePath: string) {
    console.debug("Main - create folder structure")
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