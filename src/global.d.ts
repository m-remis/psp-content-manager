// global.d.ts
declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string | null>;
            createFolder: (directoryPath: string, folderName: string) => Promise<boolean>;
        };
    }
}

// This line is necessary to make TypeScript treat this file as a module
export {};