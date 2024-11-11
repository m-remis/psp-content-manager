import path from "path";
import {app} from "electron";
import fs from "fs";
import axios from "axios";
import AdmZip from "adm-zip";
import {ARK4_type, folderMap} from "../../constants/psp_folder_constants";
import {downloadFile} from "../client/http_download_client";
import {githubArk4ReleaseApiUrl} from "../../constants/app_constants";

const downloadsDir = app.getPath('downloads');
const arkZipPath = path.join(downloadsDir, 'ARK4.zip');

async function extractArk4(ark4PathOverride: string, directoryPath: string, type: ARK4_type) : Promise<string> {
    console.debug("Extracting ARK4...")
    try {
        let filePath = '';
        if (ark4PathOverride) {
            console.debug(`Using local file: ${ark4PathOverride}`);
            filePath = ark4PathOverride;
        } else {
            console.debug(`No local file provided`);
            filePath = await getLocalOrDownloadNew();
        }
        const zip = new AdmZip(filePath);
        await extractArkFolders(zip, directoryPath, type);
        return "Extracted";
    } catch (error) {
        console.error("Error extracting ARK4.zip:", error);
        return "Failed to extract folders.";
    }
}

async function extractArkFolders(zip: AdmZip, directoryPath: string, type: ARK4_type) {
    console.debug(`Extracting ARK4 type: ${type}`)
    await fs.promises.mkdir(path.join(directoryPath, folderMap["psp_game"]), {recursive: true});
    if (type === "temp") {
        await fs.promises.mkdir(path.join(directoryPath, folderMap["saveFiles"]), {recursive: true});
        zip.extractEntryTo('ARK_01234/', path.join(directoryPath, folderMap["saveFiles"]), true, true);
        zip.extractEntryTo('ARK_Loader/', path.join(directoryPath, folderMap["psp_game"]), true, true);
        return;
    }
    if (type === "cIPL") {
        zip.extractEntryTo('PSP/ARK_cIPL/', path.join(directoryPath, folderMap["psp_game"], "ARK_cIPL"), false, true);
        return;
    }
    if (type === "full") {
        zip.extractEntryTo('PSP/ARK_Full_Installer/', path.join(directoryPath, folderMap["psp_game"], "ARK_Full_Installer"), false, true);
        return;
    }
    if (type === "update") {
        zip.extractEntryTo('UPDATE/', path.join(directoryPath, folderMap["psp_game"]), true, true);
    }
}

// looks into arkZipPath, if not present, downloads new release and returns path to downloaded file
async function getLocalOrDownloadNew(): Promise<string> {
    try {
        await fs.promises.access(arkZipPath);
        console.log(`Found existing file, using existing ARK4.zip in ${arkZipPath}`);
        return arkZipPath;
    } catch {
        console.log("Downloading latest ARK4.zip from GitHub...");
        const releaseInfo = await axios.get(githubArk4ReleaseApiUrl);
        const asset = releaseInfo.data.assets.find((a: any) => a.name === 'ARK4.zip');

        if (!asset) throw new Error("ARK4.zip not found in the latest GitHub release.");

        return downloadFile(asset.browser_download_url, arkZipPath);
    }
}

export {extractArk4};