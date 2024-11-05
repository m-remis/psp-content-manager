declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string | null>;
            createFolder: (directoryPath: string) => Promise<boolean>;
            transferUpdate: (directoryPath: string) => Promise<string>;
            isTargetEmpty: (directoryPath: string) => Promise<boolean>;
            openTargetDirectory: (directoryPath: string, folderName: string) => Promise<boolean>;
            openRootDirectory: (directoryPath: string) => Promise<boolean>;
            extractArk4: (directoryPath: string) => Promise<string | null>;
            extractChronoswitch: (directoryPath: string) => Promise<string | null>;
        };
    }
}
export {};