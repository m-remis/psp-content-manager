console.log("Renderer")
// Function to handle button click
document.getElementById('selectMemoryCardButton')!.addEventListener('click', async () => {
    // Call the openFileDialog function from the preload script
    const filePath = await window.electron.openFileDialog();

    // Update the status indicator based on the file selection
    const statusIndicator = document.getElementById('statusIndicator')!;
    const createFileStructureButton = document.getElementById('createFileStructureButton')!;

    if (filePath) {
        statusIndicator.textContent = `Selected: ${filePath}`;
        // Show the create file structure button
        createFileStructureButton.style.display = 'block';
    } else {
        statusIndicator.textContent = 'No card selected';
        // Hide the create file structure button
        createFileStructureButton.style.display = 'none';
    }
});

// Event listener for the new button (optional - to implement functionality)
document.getElementById('createFileStructureButton')!.addEventListener('click', async () => {
    const folderName = 'NewFolder'; // Name of the folder to create
    const directoryPath = document.getElementById('statusIndicator')!.textContent?.replace('Selected: ', '') || '';

    try {
        const createdFolderPath = await window.electron.createFolder(directoryPath, folderName);
        console.log(`Folder created at: ${createdFolderPath}`);
        alert(`Folder created at: ${createdFolderPath}`); // Show success message
    } catch (error: unknown) {
        console.error('Error creating folder:', error);
        if (error instanceof Error) {
            alert(`Error creating folder: ${error.message}`); // Show error message
        } else {
            alert('Error creating folder: An unknown error occurred.'); // Fallback for unexpected error types
        }
    }
});