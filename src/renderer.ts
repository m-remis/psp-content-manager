const pathIndicatorId = 'pathIndicator';
const noMemoryCardSelectedMsg = 'No card selected';

let directoryPath: string = '';

const buttonIds = {
    main: {
        selectMemoryCard: 'btnSelectMemoryCard',
        createFileStructure: 'btnCreateFileStructure',
        openCardDir: 'brnOpenCardDir',
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
        extractArk4: 'btnExtractArk4',
        extractChronoswitch: 'btnExtractChronoswitch',
        transferOfw: 'btnTransferOfw',
        createPlaylist: 'btnCreatePlaylist',
        organizeGames: 'btnOrganizeGames',
    },
};

const buttonActions = {
    [buttonIds.main.selectMemoryCard]: selectMemoryCard,
    [buttonIds.main.createFileStructure]: createFileStructure,
    [buttonIds.main.openCardDir]: openCardDir,
    [buttonIds.openFolders.plugins]: () => openTargetDirectory('plugins'),
    [buttonIds.openFolders.themes]: () => openTargetDirectory('themes'),
    [buttonIds.openFolders.games]: () => openTargetDirectory('games'),
    [buttonIds.openFolders.music]: () => openTargetDirectory('music'),
    [buttonIds.openFolders.video]: () => openTargetDirectory('videos'),
    [buttonIds.openFolders.pictures]: () => openTargetDirectory('pictures'),
    [buttonIds.openFolders.saveFiles]: () => openTargetDirectory('saveFiles'),
    [buttonIds.functions.transferOfw]: transferOfw,
    [buttonIds.functions.extractArk4]: extractArk4,
    [buttonIds.functions.extractChronoswitch]: extractChronoswitch,
    [buttonIds.functions.createPlaylist]: createNotImplementedAlert,
    [buttonIds.functions.organizeGames]: createNotImplementedAlert,
};

Object.keys(buttonActions).forEach(buttonId => {
    document.getElementById(buttonId)!.addEventListener('click', buttonActions[buttonId]);
});

async function selectMemoryCard() {
    const filePath = await window.electron.openFileDialog();
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
        const resultMessage = await window.electron.createFolder(directoryPath);
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
    const opened = await window.electron.openRootDirectory(directoryPath);
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
    const transferred = await window.electron.transferUpdate(directoryPath);
    if (transferred !== "Cancelled") {
        alert(transferred);
    }
}

async function extractArk4() {
    console.debug("Renderer - Extract ARK4...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    const extractResult = await window.electron.extractArk4(directoryPath);
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

function createNotImplementedAlert() {
    alert("Not implemented");
}

function updatePathIndicatorMessage(message: string): void {
    const pathMsgElement = document.getElementById(pathIndicatorId)!;
    pathMsgElement.textContent = message;
}

function setElementVisibility(visible: boolean, elementId: string) {
    document.getElementById(elementId)!.style.visibility = visible ? 'visible' : 'hidden';
}