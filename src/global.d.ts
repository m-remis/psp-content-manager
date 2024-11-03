declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string | null>;
            createFolder: (directoryPath: string) => Promise<boolean>;
            transferUpdate: (directoryPath: string) => Promise<string>;
            isTargetEmpty: (directoryPath: string) => Promise<boolean>;
            openTargetDirectory: (directoryPath: string, folderName: 'themes' | 'music' | 'pictures' | 'videos' | 'games' | 'saveFiles') => Promise<boolean>;
        };
    }
}
export {};