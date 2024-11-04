export const FOLDER_STRUCTURE = [
    'ISO',
    'MUSIC',
    'PICTURE',
    'PSP',
    'VIDEO',
    'seplugins',
    'ISO/VIDEO',
    'PSP/GAME661',
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

export type FolderName =
    'themes'
    | 'music'
    | 'pictures'
    | 'videos'
    | 'games'
    | 'saveFiles'
    | 'plugins'
    | 'update'
    | 'psp_game';

export const folderMap: Record<FolderName, string> = {
    themes: "PSP/THEME",
    music: "MUSIC",
    pictures: "PICTURE",
    videos: "VIDEO",
    games: "ISO",
    saveFiles: "PSP/SAVEDATA",
    plugins: "seplugins",
    update: "PSP/GAME/UPDATE",
    psp_game : "PSP/GAME"
};

export const MIN_WIDTH = 1100;
export const MIN_HEIGHT = 600;