declare global {
    interface Window {
        electron: {
            selectMemoryCardDir: () => Promise<string | null>;
            selectTargetZipFile: (type: string) => Promise<string | null>;
            createMissingFolders: (directoryPath: string) => Promise<boolean>;
            transferOfwUpdate: (directoryPath: string) => Promise<string>;
            isTargetEmpty: (directoryPath: string, folderName: string) => Promise<boolean>;
            openTargetDirectory: (directoryPath: string, folderName: string | null) => Promise<boolean>;
            extractArk4: (directoryPath: string, ark4Path: string, type: string) => Promise<string | null>;
            extractChronoswitch: (directoryPath: string, chronoSwitchPath: string) => Promise<string | null>;
            backupSaveFiles: (directoryPath: string) => Promise<string | null>;
            extractSaveFiles: (directoryPath: string) => Promise<string | null>;
        };
    }
}
export {};