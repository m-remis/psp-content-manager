import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron',
    {
        openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
        isTargetEmpty: (directoryPath: string) => ipcRenderer.invoke('folder:isEmpty', directoryPath),
        createFolder: (directoryPath: string) => ipcRenderer.invoke('folder:create', directoryPath),
        openTargetDirectory: (directoryPath: string, folderName: string) => ipcRenderer.invoke('dialog:openTargetDirectory', directoryPath, folderName),
    })