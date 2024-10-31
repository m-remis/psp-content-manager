import { contextBridge, ipcRenderer } from 'electron';

console.log("Preload")
contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    isTargetEmpty: (directoryPath: string) => ipcRenderer.invoke('folder:isEmpty', directoryPath),
    createFolder: (directoryPath: string) => ipcRenderer.invoke('folder:create', directoryPath)
});