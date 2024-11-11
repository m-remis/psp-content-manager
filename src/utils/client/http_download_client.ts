import axios from "axios";
import fs from "fs";

// returns path of downloaded file
async function downloadFile(downloadUrl: string, outputPath: string): Promise<string> {
    console.debug(`Downloading file ${downloadUrl} to ${outputPath}`)
    try {
        const response = await axios({
            url: downloadUrl,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise<string>((resolve, reject) => {
            writer.on('finish', () => resolve(outputPath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download file from ${downloadUrl}:`, error);
        throw error;
    }
}

export {downloadFile};