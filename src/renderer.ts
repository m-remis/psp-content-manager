let directoryPath: string = '';
let noFilesInDirectory: boolean = false;

// buttons
const btnSelectMemoryCardId = 'btnSelectMemoryCard';
const btnCreateFileStructureId = 'btnCreateFileStructure';
const btnOpenThemesId = 'btnOpenThemes';
const btnOpenGamesId = 'btnOpenGames';
const btnOpenMusicId = 'btnOpenMusic';
const btnOpenVideoId = 'btnOpenVideo';
const btnOpenPicturesId = 'btnOpenPictures';
const btnOpenSaveFilesId = 'btnOpenSaveFiles'

// indicator text
const pathIndicatorId = 'pathIndicator';
const createDirectoryIndicatorId = 'createDirectoryIndicator';

// msgs
const noMemoryCardSelectedMsg = 'No memory card selected';
const memoryCardNotEmptyMsg = 'Memory card is not empty';

// event listeners
document.getElementById(btnSelectMemoryCardId)!.addEventListener('click', async () => {
    const filePath = await window.electron.openFileDialog();

    if (filePath) {
        await checkDirectoryIsEmpty(filePath);
    } else {
        updatePathIndicatorMessage(noMemoryCardSelectedMsg);
        updateDirectoryIndicatorMessage('', false); // Hide the indicator
    }
});

document.getElementById(btnCreateFileStructureId)!.addEventListener('click', async () => {
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg)
        return;
    }

    if (!noFilesInDirectory) {
        alert(memoryCardNotEmptyMsg);
        return;
    }

    try {
        const resultMessage = await window.electron.createFolder(directoryPath);
        console.debug(resultMessage);

        if (resultMessage) {
            updateDirectoryIndicatorMessage('Created', true);
            noFilesInDirectory = false;
        }
    } catch (error) {
        console.error('Error creating folder structure:', error);
        alert('Error creating folder structure');
    }
});

document.getElementById(btnOpenThemesId)!.addEventListener('click', async () => {
    console.debug("Opening Themes...");
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
    console.debug("Opening Games...");
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
    console.debug("Opening Videos...");
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
    console.debug("Opening Videos...");
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
    console.debug("Opening Pictures...");
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
    console.debug("Opening Save Files...");
    if (!directoryPath) {
        alert(noMemoryCardSelectedMsg);
        return;
    }
    let opened = await window.electron.openTargetDirectory(directoryPath, 'saveFiles');
    if (!opened) {
        alert("Could not find target folder");
    }
});

// util functions
function updateDirectoryIndicatorMessage(message: string, isVisible: boolean): void {
    const dirMsgElement = document.getElementById(createDirectoryIndicatorId)!;
    dirMsgElement.textContent = message;
    dirMsgElement.style.visibility = isVisible ? 'visible' : 'hidden';
}

function updatePathIndicatorMessage(message: string): void {
    const pathMsgElement = document.getElementById(pathIndicatorId)!;
    pathMsgElement.textContent = message;
}

async function checkDirectoryIsEmpty(filePath: string): Promise<void> {
    directoryPath = filePath;
    updatePathIndicatorMessage(`Selected: ${directoryPath}`);
    noFilesInDirectory = await window.electron.isTargetEmpty(filePath);

    if (noFilesInDirectory) {
        updateDirectoryIndicatorMessage('', false); // Hide if empty
    } else {
        updateDirectoryIndicatorMessage('Memory card is not empty!', true);
    }
}