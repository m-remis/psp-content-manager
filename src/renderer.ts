// buttons main
const btnSelectMemoryCardId = 'btnSelectMemoryCard';
const btnCreateFileStructureId = 'btnCreateFileStructure';
// buttons open folders
const btnOpenThemesId = 'btnOpenThemes';
const btnOpenGamesId = 'btnOpenGames';
const btnOpenMusicId = 'btnOpenMusic';
const btnOpenVideoId = 'btnOpenVideo';
const btnOpenPicturesId = 'btnOpenPictures';
const btnOpenSaveFilesId = 'btnOpenSaveFiles'
const brnOpenCardDir = 'brnOpenCardDir';
const btnOpenPlugins = 'btnOpenPlugins';
// buttons functions
const btnExtractArk4 = 'btnExtractArk4';
const btnExtractChronoswitch = 'btnExtractChronoswitch';
const btnTransferOfw = 'btnTransferOfw';
const btnCreatePlaylist = 'btnCreatePlaylist';
const btnOrganizeGames = 'btnOrganizeGames';
// indicator text
const pathIndicatorId = 'pathIndicator';

// msgs
const noMemoryCardSelectedMsg = 'No card selected';

let directoryPath: string = '';
let noFilesInDirectory: boolean = false;

document.getElementById(btnSelectMemoryCardId)!.addEventListener('click', async () => {
    const filePath = await window.electron.openFileDialog();

    if (filePath) {
        directoryPath = filePath;
        updatePathIndicatorMessage(`Selected: ${directoryPath}`);
        setElementVisibility(true, brnOpenCardDir);
    } else {
        updatePathIndicatorMessage(noMemoryCardSelectedMsg);
    }
});

document.getElementById(btnCreateFileStructureId)!.addEventListener('click', async () => {
    console.debug("Renderer - create file structure")
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg)
        return;
    }

    try {
        const resultMessage = await window.electron.createFolder(directoryPath);
        console.debug(resultMessage);

        if (resultMessage) {
            alert("Created")
            noFilesInDirectory = false;
        }
    } catch (error) {
        console.error('Renderer - Error creating folder structure:', error);
        alert('Error creating folder structure');
    }
});

document.getElementById(brnOpenCardDir)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening card directory...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openRootDirectory(directoryPath);
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenPlugins)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Plugins...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, 'plugins');
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenThemesId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Themes...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, 'themes');
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenGamesId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Games...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, "games");
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenMusicId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Videos...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, "music");
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenVideoId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Videos...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, 'videos');
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenPicturesId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Pictures...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, "pictures");
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnOpenSaveFilesId)!.addEventListener('click', async () => {
    console.debug("Renderer - Opening Save Files...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, 'saveFiles');
    if (!opened) {
        alert("Could not find target folder");
    }
});

document.getElementById(btnTransferOfw)!.addEventListener('click', async () => {
    console.debug("Renderer - Transfer ofw...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let transferred = await window.electron.transferUpdate(directoryPath);
    if (transferred != "Cancelled") {
        alert(transferred);
    }
});

document.getElementById(btnExtractArk4)!.addEventListener('click', async () => {
    console.debug("Renderer - Extract ARK4...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let extractResult = await window.electron.extractArk4(directoryPath);
    if (extractResult != "Cancelled") {
        alert(extractResult);
    }
});

document.getElementById(btnExtractChronoswitch)!.addEventListener('click', async () => {
    console.debug("Renderer - Extract Chronoswitch...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let extractResult = await window.electron.extractChronoswitch(directoryPath);
    if (extractResult != "Cancelled") {
        alert(extractResult);
    }
});

document.getElementById(btnCreatePlaylist)!.addEventListener('click', async () => {
    console.debug("Renderer - Create playlist...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    alert("Not implemented");
});

document.getElementById(btnOrganizeGames)!.addEventListener('click', async () => {
    console.debug("Renderer - Organize games...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    alert("Not implemented");
});

function updatePathIndicatorMessage(message: string): void {
    const pathMsgElement = document.getElementById(pathIndicatorId)!;
    pathMsgElement.textContent = message;
}

function setElementVisibility(visible: boolean, elementId: string) {
    document.getElementById(elementId)!.style.visibility = visible ? 'visible' : 'hidden';
}

async function checkDirectoryIsEmpty(filePath: string): Promise<boolean> {
    directoryPath = filePath;
    return await window.electron.isTargetEmpty(filePath);
}