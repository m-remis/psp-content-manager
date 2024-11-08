declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string | null>;
            createMissingFolders: (directoryPath: string) => Promise<boolean>;
            transferOfwUpdate: (directoryPath: string) => Promise<string>;
            isTargetEmpty: (directoryPath: string, folderName: string) => Promise<boolean>;
            openTargetDirectory: (directoryPath: string, folderName: string) => Promise<boolean>;
            openRootDirectory: (directoryPath: string) => Promise<boolean>;
            extractArk4: (directoryPath: string, type: string) => Promise<string | null>;
            extractChronoswitch: (directoryPath: string) => Promise<string | null>;
            backupSaveFiles: (directoryPath: string) => Promise<string | null>;
            extractSaveFiles: (directoryPath: string) => Promise<string | null>;
        };
    }
}
export {};