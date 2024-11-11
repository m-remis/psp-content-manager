import {FOLDER_STRUCTURE, folderMap, FolderName, TargetZipFileType} from "../../constants/psp_folder_constants";
import {dialog, shell} from "electron";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

async function selectArkOrChronoSwitch(type: TargetZipFileType): Promise<string | null> {
    console.debug(`Selecting zip type: ${type}`);
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{name: 'ZIP Files', extensions: ['zip']}]
    });
    const dir = result.filePaths[0];
    if (type === "ChronoSwitch") {
        if (!/^ChronoSwitch_v[\d.]+\.zip$/.test(path.basename(dir))) {
            console.debug("Error: Invalid file selected. Please select a file named 'ChronoSwitch_vX.X.zip'.");
            return null;
        }
    }
    if (type === "ARK4") {
        if (path.basename(dir) !== 'ARK4.zip') {
            console.debug("Invalid file selected. Please select 'ARK4.zip'.");
            return null;
        }
    }
    return result.filePaths[0] || null;
}

async function createBaseFolderStructure(basePath: string) {
    console.debug("Creating folder structure as needed");
    try {
        for (const folder of FOLDER_STRUCTURE) {
            const folderPath = path.join(basePath, folder);

            try {
                await fs.promises.access(folderPath);
                console.debug(`Directory already exists: ${folderPath}`);
            } catch {
                await fs.promises.mkdir(folderPath, {recursive: true});
                console.debug(`Created missing directory: ${folderPath}`);
            }
        }
        console.debug('Folder structure checked and missing folders created successfully.');
    } catch (error) {
        console.error('Error while creating folder structure:', error);
        throw new Error('Failed to ensure folder structure.');
    }
}

async function isTargetDirEmpty(directoryPath: string, folderName: FolderName): Promise<boolean> {
    console.debug("Is target empty")
    const targetDir = folderName ? path.join(directoryPath, folderMap[folderName]) : directoryPath;
    const files = await fs.promises.readdir(targetDir);
    return files.length === 0;
}

async function transferUpdate(directoryPath: string): Promise<string> {
    console.debug("Transfer update")
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{name: 'PBP Files', extensions: ['pbp']}]
    });
    if (result.canceled) return "Cancelled";

    const selectedFilePath = result.filePaths[0];
    const destinationPath = path.join(directoryPath, folderMap["update"], 'EBOOT.PBP');
    await fs.promises.mkdir(path.dirname(destinationPath), {recursive: true});
    await fs.promises.copyFile(selectedFilePath, destinationPath);
    return "Transferred";
}

async function selectCardRoot(): Promise<string | null> {
    console.debug("Select card root")
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{name: 'All Files', extensions: ['*']}]
    });
    return result.filePaths[0] || null;
}

async function openTargetDirectory(directoryPath: string, targetFolder: FolderName | null): Promise<boolean> {
    console.debug(`Open target dir: ${targetFolder}`);
    let targetDir = directoryPath;
    if (targetFolder) {
        targetDir = path.join(targetDir, folderMap[targetFolder])
    }

    try {
        await fs.promises.stat(targetDir);
        await shell.openPath(targetDir);
        return true;
    } catch (error) {
        console.error("Error opening directory:", error);
        return false;
    }
}

async function backupSaveFiles(directoryPath: string): Promise<string> {
    console.debug("Backup save files")
    try {
        const result = await dialog.showSaveDialog({
            filters: [{name: 'Zip Files', extensions: ['zip']}]
        });

        if (result.canceled) return "Cancelled";

        const zipFilePath = result.filePath;

        const zip = new AdmZip();
        const saveFilesPath = path.join(directoryPath, folderMap["saveFiles"]);

        zip.addLocalFolder(saveFilesPath, "");

        zip.writeZip(zipFilePath);

        return `Backup created successfully at: ${zipFilePath}`;
    } catch (error) {
        console.error("Error backing up save files:", error);
        return "Failed to backup save files.";
    }
}

async function extractSaveFiles(directoryPath: string): Promise<string> {
    console.debug("Extract save files")
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'Zip Files', extensions: ['zip']}]
        });

        if (result.canceled) return "Cancelled";

        const zipFilePath = result.filePaths[0];

        const zip = new AdmZip(zipFilePath);

        const saveFilesPath = path.join(directoryPath, folderMap["saveFiles"]);
        zip.extractAllTo(saveFilesPath, true);

        return "Save files extracted successfully.";
    } catch (error) {
        console.error("Error extracting save files:", error);
        return "Failed to extract save files.";
    }
}

export {
    selectArkOrChronoSwitch,
    createBaseFolderStructure,
    isTargetDirEmpty,
    transferUpdate,
    selectCardRoot,
    openTargetDirectory,
    backupSaveFiles,
    extractSaveFiles
};