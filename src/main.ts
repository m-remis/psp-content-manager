import {app, BrowserWindow, ipcMain, dialog, shell} from 'electron';
import {promises as fs} from 'fs';
import path from 'path';
import {
    FOLDER_STRUCTURE,
    GAMES_FOLDER,
    MIN_HEIGHT,
    MIN_WIDTH, MUSIC_FOLDER,
    PICTURES_FOLDER,
    SAVE_FILES_FOLDER, THEMES_FOLDER,
    VIDEO_FOLDER
} from "./constants";

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
    console.debug("Main - second instance")
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

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

ipcMain.handle('folder:create', async (_event, directoryPath: string) => {
    console.debug("Main - folder create")
    await createFolderStructure(directoryPath);
    return `Folder structure created at: ${directoryPath}`;
});

ipcMain.handle('folder:isEmpty', async (_event, directoryPath: string): Promise<boolean> => {
    console.debug("Main - folder is empty")
    try {
        const files = await fs.readdir(directoryPath);
        return files.length === 0; // Returns true if empty, false if not
    } catch (error) {
        console.debug('Error checking if directory is empty:', error);
        throw new Error('Could not check directory contents.');
    }
});


// todo do something about this...
// Define a type for folder names
type FolderName = 'themes' | 'music' | 'pictures' | 'videos' | 'games' | 'saveFiles';

// Folder mapping
const folderMap: Record<FolderName, string> = {
    themes: THEMES_FOLDER,
    music: MUSIC_FOLDER,
    pictures: PICTURES_FOLDER,
    videos: VIDEO_FOLDER,
    games: GAMES_FOLDER,
    saveFiles: SAVE_FILES_FOLDER,
};

ipcMain.handle('dialog:openTargetDirectory', async (_event, directoryPath: string, targetFolder: FolderName) => {
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