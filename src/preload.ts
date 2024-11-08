import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron',
    {
        openFileDialog: () => ipcRenderer.invoke('dialog:selectMemoryCardRoot'),
        isTargetEmpty: (directoryPath: string, folderName: string) => ipcRenderer.invoke('folder:isEmpty', directoryPath, folderName),
        createMissingFolders: (directoryPath: string) => ipcRenderer.invoke('folder:createMissingFiles', directoryPath),
        openTargetDirectory: (directoryPath: string, folderName: string) => ipcRenderer.invoke('dialog:openTargetDirectory', directoryPath, folderName),
        transferOfwUpdate: (directoryPath: string) => ipcRenderer.invoke('dialog:transferUpdate', directoryPath),
        extractArk4: (directoryPath: string, type: string) => ipcRenderer.invoke('dialog:extractArk4', directoryPath, type),
        extractChronoswitch: (directoryPath: string) => ipcRenderer.invoke('dialog:extractChronoswitch', directoryPath),
        backupSaveFiles: (directoryPath: string) => ipcRenderer.invoke('dialog:backupSaveFiles', directoryPath),
        extractSaveFiles: (directoryPath: string) => ipcRenderer.invoke('dialog:extractSaveFiles', directoryPath)
    })