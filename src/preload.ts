import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron',
    {
        selectMemoryCardDir: () => ipcRenderer.invoke('dialog:selectMemoryCardRoot'),
        selectTargetZipFile: (type: string) => ipcRenderer.invoke('dialog:selectTargetZipFile', type),
        isTargetEmpty: (directoryPath: string, folderName: string) => ipcRenderer.invoke('folder:isEmpty', directoryPath, folderName),
        createMissingFolders: (directoryPath: string) => ipcRenderer.invoke('folder:createMissingFiles', directoryPath),
        openTargetDirectory: (directoryPath: string, folderName: string) => ipcRenderer.invoke('dialog:openTargetDirectory', directoryPath, folderName),
        transferOfwUpdate: (directoryPath: string) => ipcRenderer.invoke('dialog:transferUpdate', directoryPath),
        extractArk4: (directoryPath: string, ark4Path: string, type: string) => ipcRenderer.invoke('dialog:extractArk4', directoryPath, ark4Path, type),
        extractChronoswitch: (directoryPath: string, chronoSwitchPath: string) => ipcRenderer.invoke('dialog:extractChronoswitch', directoryPath, chronoSwitchPath),
        backupSaveFiles: (directoryPath: string) => ipcRenderer.invoke('dialog:backupSaveFiles', directoryPath),
        extractSaveFiles: (directoryPath: string) => ipcRenderer.invoke('dialog:extractSaveFiles', directoryPath)
    })