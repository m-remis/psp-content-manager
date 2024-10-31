declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string | null>;
            createFolder: (directoryPath: string) => Promise<boolean>;
            isTargetEmpty: (directoryPath: string) => Promise<boolean>;
        };
    }
}
export {};