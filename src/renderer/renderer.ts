const pathIndicatorId = 'pathIndicator';
const noMemoryCardSelectedMsg = 'No card selected';

let directoryPath: string = '';

const buttonIds = {
    main: {
        selectMemoryCard: 'btnSelectMemoryCard',
        openCardDir: 'brnOpenCardDir'
    },
    openFolders: {
        themes: 'btnOpenThemes',
        games: 'btnOpenGames',
        music: 'btnOpenMusic',
        video: 'btnOpenVideo',
        pictures: 'btnOpenPictures',
        saveFiles: 'btnOpenSaveFiles',
        plugins: 'btnOpenPlugins',
    },
    functions: {
        backupSaveFiles: 'btnBackupSaveFiles',
        extractSaveFiles: 'btnExtractSaveFiles',
        createFileStructure: 'btnCreateFileStructure'
    },
    firmware: {
        extractArk4Temp: 'btnExtractArk4Tmp',
        extractArk4Cipl: 'btnExtractArk4Cipl',
        extractArk4Full: 'btnExtractArk4Full',
        extractArk4Update: 'btnExtractArk4Update',
        extractChronoswitch: 'btnExtractChronoswitch',
        transferOfw: 'btnTransferOfw'
    }
};

const buttonActions = {
    [buttonIds.main.selectMemoryCard]: selectMemoryCard,
    [buttonIds.main.openCardDir]: openCardDir,
    [buttonIds.openFolders.plugins]: () => openTargetDirectory('plugins'),
    [buttonIds.openFolders.themes]: () => openTargetDirectory('themes'),
    [buttonIds.openFolders.games]: () => openTargetDirectory('games'),
    [buttonIds.openFolders.music]: () => openTargetDirectory('music'),
    [buttonIds.openFolders.video]: () => openTargetDirectory('videos'),
    [buttonIds.openFolders.pictures]: () => openTargetDirectory('pictures'),
    [buttonIds.openFolders.saveFiles]: () => openTargetDirectory('saveFiles'),
    [buttonIds.firmware.transferOfw]: transferOfw,
    [buttonIds.firmware.extractArk4Temp]: () => extractArk4('temp'),
    [buttonIds.firmware.extractArk4Cipl]: () => extractArk4('cIPL'),
    [buttonIds.firmware.extractArk4Full]: () => extractArk4('full'),
    [buttonIds.firmware.extractArk4Update]: () => extractArk4('update'),
    [buttonIds.firmware.extractChronoswitch]: extractChronoswitch,
    [buttonIds.functions.createFileStructure]: createFileStructure,
    [buttonIds.functions.backupSaveFiles]: backupSaveFiles,
    [buttonIds.functions.extractSaveFiles]: extractSaveFiles
};

Object.keys(buttonActions).forEach(buttonId => {
    document.getElementById(buttonId)!.addEventListener('click', buttonActions[buttonId]);
});

async function selectMemoryCard() {
    const filePath = await window.electron.selectMemoryCardDir();
    if (filePath) {
        directoryPath = filePath;
        updatePathIndicatorMessage(`Selected: ${directoryPath}`);
        setElementVisibility(true, buttonIds.main.openCardDir);
    } else {
        updatePathIndicatorMessage(noMemoryCardSelectedMsg);
    }
}

async function createFileStructure() {
    console.debug("Renderer - create file structure");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }

    try {
        const resultMessage = await window.electron.createMissingFolders(directoryPath);
        console.debug(resultMessage);
        alert(resultMessage ? "Created" : "Error creating folder structure");
    } catch (error) {
        console.error('Renderer - Error creating folder structure:', error);
        alert('Error creating folder structure');
    }
}

async function openCardDir() {
    console.debug("Renderer - Opening card directory...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const opened = await window.electron.openTargetDirectory(directoryPath, null);
    if (!opened) {
        alert("Could not find target folder");
    }
}

async function openTargetDirectory(folder: string) {
    console.debug(`Renderer - Opening ${folder}...`);
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const opened = await window.electron.openTargetDirectory(directoryPath, folder);
    if (!opened) {
        alert("Could not find target folder");
    }
}

async function transferOfw() {
    console.debug("Renderer - Transfer ofw...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const transferred = await window.electron.transferOfwUpdate(directoryPath);
    if (transferred !== "Cancelled") {
        alert(transferred);
    }
}

async function extractArk4(type: string) {
    console.debug(`Renderer - Extract ARK4- ${type}`, type);
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const extractResult = await window.electron.extractArk4(directoryPath, type);
    if (extractResult !== "Cancelled") {
        alert(extractResult);
    }
}

async function extractChronoswitch() {
    console.debug("Renderer - Extract Chronoswitch...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const extractResult = await window.electron.extractChronoswitch(directoryPath);
    if (extractResult !== "Cancelled") {
        alert(extractResult);
    }
}

async function backupSaveFiles() {
    console.debug("Renderer - Backup save files...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const saveFilesEmpty = await window.electron.isTargetEmpty(directoryPath, "saveFiles");
    if (saveFilesEmpty) {
        alert("No save files on memory card");
        return;
    }

    const extractResult = await window.electron.backupSaveFiles(directoryPath);
    if (extractResult !== "Cancelled") {
        alert(extractResult);
    }
}

async function extractSaveFiles() {
    console.debug("Renderer - Extract save files...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const extractResult = await window.electron.extractSaveFiles(directoryPath);
    if (extractResult !== "Cancelled") {
        alert(extractResult);
    }
}

function updatePathIndicatorMessage(message: string): void {
    const pathMsgElement = document.getElementById(pathIndicatorId)!;
    pathMsgElement.textContent = message;
}

function setElementVisibility(visible: boolean, elementId: string) {
    document.getElementById(elementId)!.style.visibility = visible ? 'visible' : 'hidden';
}