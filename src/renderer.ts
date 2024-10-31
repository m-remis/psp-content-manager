let directoryPath: string = '';
let noFilesInDirectory: boolean = false;

// Element IDs
const selectMemoryCardButtonId = 'selectMemoryCardButton';
const createFileStructureButtonId = 'createFileStructureButton';
const pathIndicatorId = 'pathIndicator';
const createDirectoryIndicatorId = 'createDirectoryIndicator';

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

// Event listener for selecting the memory card
document.getElementById(selectMemoryCardButtonId)!.addEventListener('click', async () => {
    const filePath = await window.electron.openFileDialog();

    if (filePath) {
        await checkDirectoryIsEmpty(filePath);
    } else {
        updatePathIndicatorMessage('No card selected');
        updateDirectoryIndicatorMessage('', false); // Hide the indicator
    }
});

// Event listener for creating the folder structure
document.getElementById(createFileStructureButtonId)!.addEventListener('click', async () => {
    if (!noFilesInDirectory) {
        updateDirectoryIndicatorMessage('Memory card is not empty!', true);
        return;
    }

    try {
        const resultMessage = await window.electron.createFolder(directoryPath);
        console.debug(resultMessage);
        alert(resultMessage); // Consider replacing with SweetAlert2 for a better UI

        if (resultMessage) {
            noFilesInDirectory = false; // Mark as non-empty after folder creation
        }
    } catch (error) {
        console.error('Error creating folder structure:', error);
        alert('Error creating folder structure'); // Show error alert
    }
});