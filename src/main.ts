import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import * as path from 'path';

import {ARK4_type, FolderName, TargetZipFileType} from "./constants/psp_folder_constants";
import {INSTANCE_WINDOW_MIN_HEIGHT, INSTANCE_WINDOW_MIN_WIDTH, MENU_CONTENT} from "./constants/app_constants";
import {extractArk4} from "./utils/ark4/ark4_service";
import {extractChronoSwitch} from "./utils/chronoswitch/chronoswitch_service";
import {
    backupSaveFiles,
    createBaseFolderStructure, extractSaveFiles,
    isTargetDirEmpty, openTargetDirectory,
    selectArkOrChronoSwitch, selectCardRoot,
    transferUpdate
} from "./utils/directory/psp_directory_utils";

let mainWindow: BrowserWindow | null;

if (!app.requestSingleInstanceLock()) {
    console.debug("Another instance is already running");
    app.quit();
} else {
    app.on('second-instance', () => handleSecondInstance());
    app.on('window-all-closed', handleAllWindowsClosed);
    app.on('activate', handleAppActivate);
    app.whenReady().then(createMainWindow);
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: INSTANCE_WINDOW_MIN_WIDTH,
        height: INSTANCE_WINDOW_MIN_HEIGHT,
        minWidth: INSTANCE_WINDOW_MIN_WIDTH,
        minHeight: INSTANCE_WINDOW_MIN_HEIGHT,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '/preload.js')
        }
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_CONTENT));
    mainWindow.loadFile(path.join(__dirname, '/renderer/index.html'));
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function handleSecondInstance() {
    console.debug("Second instance detected");
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
}

function handleAllWindowsClosed() {
    console.debug("Closing all windows");
    if (process.platform !== 'darwin') app.quit();
}

function handleAppActivate() {
    console.debug("Activate");
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
}

ipcMain.handle('dialog:selectMemoryCardRoot', handleSelectCardRoot);
ipcMain.handle('dialog:selectTargetZipFile', handleSelectTargetZipFile);
ipcMain.handle('folder:createMissingFiles', handleCreateAllMissingFiles);
ipcMain.handle('folder:isEmpty', handleIsFolderEmpty);
ipcMain.handle('dialog:transferUpdate', handleTransferUpdate);
ipcMain.handle('dialog:openTargetDirectory', handleOpenTargetDirectory);
ipcMain.handle('dialog:extractArk4', handleExtractArk4);
ipcMain.handle('dialog:extractChronoswitch', handleExtractChronoswitch);
ipcMain.handle('dialog:extractSaveFiles', handleExtractSaveFiles);
ipcMain.handle('dialog:backupSaveFiles', handleBackupSaveFiles);

async function handleSelectCardRoot() {
    return await selectCardRoot();
}

async function handleCreateAllMissingFiles(_event: any, directoryPath: string) : Promise<string> {
    try {
        await createBaseFolderStructure(directoryPath);
        return `Folder structure created at: ${directoryPath}`;
    } catch (error) {
        console.error("Error creating folder structure:", error);
        return "Failed to create folder structure";
    }
}

async function handleIsFolderEmpty(_event: any, directoryPath: string, folderName: FolderName): Promise<boolean> {
    return await isTargetDirEmpty(directoryPath, folderName);
}

async function handleTransferUpdate(_event: any, directoryPath: string) : Promise<string> {
    return await transferUpdate(directoryPath);
}

async function handleOpenTargetDirectory(_event: any, directoryPath: string, targetFolder: FolderName | null) : Promise<boolean> {
    return await openTargetDirectory(directoryPath, targetFolder);
}

async function handleSelectTargetZipFile(_event: any, type: TargetZipFileType): Promise<string | null> {
    return await selectArkOrChronoSwitch(type);
}

async function handleExtractArk4(_event: any, directoryPath: string, ark4Path: string, type: ARK4_type): Promise<string> {
    return await extractArk4(ark4Path, directoryPath, type);
}

async function handleExtractChronoswitch(_event: any, directoryPath: string, chronoSwitchPath: string) {
    return await extractChronoSwitch(directoryPath, chronoSwitchPath);
}

async function handleBackupSaveFiles(_event: any, directoryPath: string) : Promise<string> {
    return await backupSaveFiles(directoryPath);
}

async function handleExtractSaveFiles(_event: any, directoryPath: string): Promise<string> {
    return await extractSaveFiles(directoryPath);
}