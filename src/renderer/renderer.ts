const pathIndicatorId = 'pathIndicator';
const ark4PathIndicatorId = 'ark4PathIndicator';
const chronoSwitchPathIndicatorId = 'chronoSwitchPathIndicator';
const loadingSpinnerId = 'loadingSpinner';
const noMemoryCardSelectedMsg = 'No card selected';

let directoryPath: string = '';
let ark4directoryPath: string = '';
let chronoSwitchDirectoryPath: string = '';

const buttonIds = {
    main: {
        selectMemoryCard: 'btnSelectMemoryCard',
        openCardDir: 'brnOpenCardDir'
    },
    openFolders: {
        themes: 'btnOpenThemes',
        games: 'btnOpenGames',
        iso: 'btnOpenIso',
        music: 'btnOpenMusic',
        video: 'btnOpenVideo',
        pictures: 'btnOpenPictures',
        saveFiles: 'btnOpenSaveFiles',
        plugins: 'btnOpenPlugins'
    },
    functions: {
        backupSaveFiles: 'btnBackupSaveFiles',
        extractSaveFiles: 'btnExtractSaveFiles',
        createFileStructure: 'btnCreateFileStructure',
        transferOfw: 'btnTransferOfw'
    },
    ark4: {
        selectArk4File: 'btnSelectArk4',
        extractArk4Temp: 'btnExtractArk4Tmp',
        extractArk4Cipl: 'btnExtractArk4Cipl',
        extractArk4Full: 'btnExtractArk4Full',
        extractArk4Update: 'btnExtractArk4Update'
    },
    chronoSwitch: {
        selectChronoSwitchDir: 'btnSelectChronoSwitch',
        extractChronoswitch: 'btnExtractChronoswitch'
    }
};

const buttonActions = {
    [buttonIds.main.selectMemoryCard]: selectMemoryCard,
    [buttonIds.main.openCardDir]: () => openTargetDirectory(null),

    [buttonIds.openFolders.plugins]: () => openTargetDirectory('plugins'),
    [buttonIds.openFolders.themes]: () => openTargetDirectory('themes'),
    [buttonIds.openFolders.games]: () => openTargetDirectory('games'),
    [buttonIds.openFolders.iso]: () => openTargetDirectory('iso'),
    [buttonIds.openFolders.music]: () => openTargetDirectory('music'),
    [buttonIds.openFolders.video]: () => openTargetDirectory('videos'),
    [buttonIds.openFolders.pictures]: () => openTargetDirectory('pictures'),
    [buttonIds.openFolders.saveFiles]: () => openTargetDirectory('saveFiles'),

    [buttonIds.functions.createFileStructure]: createFileStructure,
    [buttonIds.functions.backupSaveFiles]: backupSaveFiles,
    [buttonIds.functions.extractSaveFiles]: extractSaveFiles,
    [buttonIds.functions.transferOfw]: transferOfw,

    [buttonIds.ark4.selectArk4File]: () => selectZipFile("ARK4"),
    [buttonIds.ark4.extractArk4Temp]: () => extractArk4('temp'),
    [buttonIds.ark4.extractArk4Cipl]: () => extractArk4('cIPL'),
    [buttonIds.ark4.extractArk4Full]: () => extractArk4('full'),
    [buttonIds.ark4.extractArk4Update]: () => extractArk4('update'),

    [buttonIds.chronoSwitch.extractChronoswitch]: extractChronoSwitch,
    [buttonIds.chronoSwitch.selectChronoSwitchDir]: () => selectZipFile("ChronoSwitch"),
};

Object.keys(buttonActions).forEach(buttonId => {
    document.getElementById(buttonId)!.addEventListener('click', buttonActions[buttonId]);
});

async function selectMemoryCard() {
    const filePath = await window.electron.selectMemoryCardDir();
    if (filePath) {
        directoryPath = filePath;
        updatePathIndicatorMessage(pathIndicatorId, `Selected: ${directoryPath}`);
        setElementVisibility(true, buttonIds.main.openCardDir);
    } else {
        updatePathIndicatorMessage(pathIndicatorId, noMemoryCardSelectedMsg);
    }
}

async function selectZipFile(target: string) {
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const filePath = await window.electron.selectTargetZipFile(target);
    if (!filePath) {
        alert(`Could not select ${target} file`);
        return;
    }
    if (target === "ARK4") {
        ark4directoryPath = filePath;
        updatePathIndicatorMessage(ark4PathIndicatorId, `Selected: ${ark4directoryPath}`);
    }
    if (target === "ChronoSwitch") {
        chronoSwitchDirectoryPath = filePath;
        updatePathIndicatorMessage(chronoSwitchPathIndicatorId, `Selected: ${chronoSwitchDirectoryPath}`);
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

async function openTargetDirectory(folder: string | null) {
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
    await window.electron.transferOfwUpdate(directoryPath)
        .then(transferResult => {
            if (transferResult !== "Cancelled") {
                alert(transferResult);
            }
        });
}

async function extractArk4(type: string) {
    console.debug(`Renderer - Extract ARK4- ${type}`, type);
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    showLoadingSpinner();
    await window.electron.extractArk4(directoryPath, ark4directoryPath, type)
        .then(result => {
            hideLoadingSpinner();
            setTimeout(() => {
                alert(result);
            }, 100);
        });
}

async function extractChronoSwitch() {
    console.debug("Renderer - Extract ChronoSwitch...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    showLoadingSpinner();
    await window.electron.extractChronoswitch(directoryPath, chronoSwitchDirectoryPath)
        .then(result => {
            hideLoadingSpinner();
            setTimeout(() => {
                alert(result);
            }, 100);
        });
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
    await window.electron.backupSaveFiles(directoryPath)
        .then(extractResult => {
            if (extractResult !== "Cancelled") {
                alert(extractResult);
            }
        });
}

async function extractSaveFiles() {
    console.debug("Renderer - Extract save files...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    await window.electron.extractSaveFiles(directoryPath).then(extractResult => {
        if (extractResult !== "Cancelled") {
            alert(extractResult);
        }
    });
}

function updatePathIndicatorMessage(indicatorId: string, message: string): void {
    const pathMsgElement = document.getElementById(indicatorId)!;
    pathMsgElement.textContent = message;
}

function setElementVisibility(visible: boolean, elementId: string) {
    document.getElementById(elementId)!.style.visibility = visible ? 'visible' : 'hidden';
}

function showLoadingSpinner() {
    document.getElementById(loadingSpinnerId)!.style.display = "flex";
}

function hideLoadingSpinner() {
    document.getElementById(loadingSpinnerId)!.style.display = "none";
}