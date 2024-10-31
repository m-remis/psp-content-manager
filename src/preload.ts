import { contextBridge, ipcRenderer } from 'electron';

console.log("Preload")
contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    createFolder: (directoryPath: string, folderName: string) => ipcRenderer.invoke('folder:create', directoryPath, folderName)
});