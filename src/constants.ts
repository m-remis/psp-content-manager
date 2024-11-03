export const FOLDER_STRUCTURE = [
    'ISO',
    'MUSIC',
    'PICTURE',
    'PSP',
    'VIDEO',
    'seplugins',
    'ISO/VIDEO',
    'PSP/GAME661', //todo fix this
    'PSP/GAME150',
    'PSP/COMMON',
    'PSP/GAME',
    'PSP/SAVEDATA',
    'PSP/SYSTEM',
    'PSP/GAME/UPDATE',
    'PSP/SYSTEM/BROWSER',
    'PSP/SYSTEM/RRSCH',
    'PSP/SYSTEM/RSSCH/CHANNELS',
    'PSP/THEME',
    'PSP/LICENSE',
    'PSP/GAME/RECOVERY'
];

// Define a type for folder names
export type FolderName = 'themes' | 'music' | 'pictures' | 'videos' | 'games' | 'saveFiles';

// Folder mapping
export const folderMap: Record<FolderName, string> = {
    themes: "PSP/THEME",
    music: "MUSIC",
    pictures: "PICTURE",
    videos: "VIDEO",
    games: "ISO",
    saveFiles: "PSP/SAVEDATA",
};

export const MIN_WIDTH = 1200;
export const MIN_HEIGHT = 690;
