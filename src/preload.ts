import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron',
    {
        openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
        isTargetEmpty: (directoryPath: string) => ipcRenderer.invoke('folder:isEmpty', directoryPath),
        createMissingFolders: (directoryPath: string) => ipcRenderer.invoke('folder:create', directoryPath),
        openTargetDirectory: (directoryPath: string, folderName: string) => ipcRenderer.invoke('dialog:openTargetDirectory', directoryPath, folderName),
        openRootDirectory: (directoryPath: string) => ipcRenderer.invoke('dialog:openRootDirectory', directoryPath),
        transferOfwUpdate: (directoryPath: string) => ipcRenderer.invoke('dialog:transferUpdate', directoryPath),
        extractArk4: (directoryPath: string, type: string) => ipcRenderer.invoke('dialog:extractArk4', directoryPath, type),
        extractChronoswitch: (directoryPath: string) => ipcRenderer.invoke('dialog:extractChronoswitch', directoryPath)
    })