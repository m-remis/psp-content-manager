import axios from "axios";
import path from "path";
import fs from "fs";
import {app} from "electron";
import AdmZip from "adm-zip";
import {folderMap} from "../../constants/psp_folder_constants";
import {downloadFile} from "../client/http_download_client";
import {compareVersions} from "./version_util";
import {githubChronoSwitchReleaseApiUrl} from "../../constants/app_constants";

const downloadsDir = app.getPath('downloads');

async function extractChronoSwitch(directoryPath: string, chronoSwitchPathOverride: string): Promise<string> {
    console.debug("Extracting ChronoSwitch...")
    try {
        let filePath = '';
        if (chronoSwitchPathOverride) {
            console.debug(`Using local file: ${chronoSwitchPathOverride}`)
            filePath = chronoSwitchPathOverride;
        } else {
            console.debug(`No local file provided`);
            filePath = await getLocalOrDownloadNew();
        }
        const zip = new AdmZip(filePath);
        await extractChronoswitchFoldersFromZip(zip, directoryPath);
        return "Extracted";
    } catch (error) {
        console.error("Error extracting ChronoSwitch_vX.X.zip", error);
        return "Failed to extract folders.";
    }
}

async function getLocalOrDownloadNew(): Promise<string> {
    // see if there is local file, if yest, get highest version
    const localFile = await findLocalChronoSwitchFile();
    if (localFile) {
        console.log("Using local ChronoSwitch file:", localFile);
        return localFile;
    }
    // if not, download latest release
    console.log("Downloading latest ChronoSwitch zip from GitHub...");
    const releaseInfo = await axios.get(githubChronoSwitchReleaseApiUrl);
    const asset = releaseInfo.data.assets.find((a: any) => /^ChronoSwitch.*\.zip$/.test(a.name));

    if (!asset) throw new Error("ChronoSwitch zip file not found in the latest GitHub release.");

    const outputPath = path.join(downloadsDir, asset.name || 'ChronoSwitch.zip');
    return downloadFile(asset.browser_download_url, outputPath);
}

async function extractChronoswitchFoldersFromZip(zip: AdmZip, directoryPath: string) {
    console.debug(`Extracting zip file`)
    await fs.promises.mkdir(path.join(directoryPath, 'PSP', 'GAME', 'Chronoswitch'), {recursive: true});
    const sourcePath = 'PSP/GAME/ChronoSwitch/';
    const destinationPath = path.join(directoryPath, folderMap["psp_game"], 'Chronoswitch');
    zip.extractEntryTo(sourcePath, destinationPath, false, true);
}

async function findLocalChronoSwitchFile(): Promise<string | null> {
    try {
        const files = await fs.promises.readdir(downloadsDir);
        const chronoSwitchZips = files.filter(file => /^ChronoSwitch_v\d+(\.\d+)?\.zip$/i.test(file.trim()));

        if (!chronoSwitchZips.length) return null;

        const latestFile = chronoSwitchZips.reduce((latest, current) => {
            const [latestVersion, currentVersion] = [latest, current].map(file => file.match(/_v([\d.]+)\.zip$/)?.[1] || '0');
            return compareVersions(currentVersion, latestVersion) > 0 ? current : latest;
        });
        const chronoSwitchPath = path.join(downloadsDir, latestFile);
        console.log(`Found existing file, using existing ChronoSwitch in ${chronoSwitchPath}`);
        return chronoSwitchPath;
    } catch (error) {
        console.error("Error reading local ChronoSwitch files:", error);
        throw error;
    }
}

export {extractChronoSwitch};