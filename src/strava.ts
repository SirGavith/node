import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';

async function unzipFile(zipFilePath: string, destinationPath: string): Promise<void> {
    const readStream = fs.createReadStream(zipFilePath);
    const extractionStream = readStream.pipe(unzipper.Extract({ path: destinationPath }));

    return new Promise((resolve, reject) => {
        extractionStream.on('finish', resolve);
        extractionStream.on('error', reject);
    });
}

async function getMostRecentZipFile(directory: string): Promise<string | null> {
    try {
        const files = await fs.promises.readdir(directory);

        const sortedFiles = files
            .filter(file => file.endsWith('.zip'))
            .map(file => ({ name: file, timestamp: fs.statSync(path.join(directory, file)).mtimeMs }))
            .sort((a, b) => b.timestamp - a.timestamp);

        return path.join(directory, sortedFiles[0].name);
    } catch (error) {
        console.error('Error getting most recent zip file:', error);
        return null;
    }
}

function HeartRateIntervalIsOne(tcx: string): boolean {
    //find second and third 
    const matches = [...tcx.matchAll(/<Time>....-..-..T..:(..):.*<\/Time>\n\s*<HeartRateBpm>/g)]
    if (matches.length < 3) return false
    if (Math.abs(matches[2][1].toInt() - matches[1][1].toInt()) <= 1) return true
    return false
}

export async function main() {
    const downloadsFolder = 'C:/Users/gavin/Downloads';

    const mostRecentZip = await getMostRecentZipFile(downloadsFolder);

    if (!mostRecentZip) {
        console.log('No zip files found in the downloads folder.');
        return;
    }

    console.log('Unzipping', mostRecentZip, '. . .')
    const destinationPath = path.join(downloadsFolder, 'unzipped');
    try {
        await fs.promises.mkdir(destinationPath, { recursive: true });
        await unzipFile(mostRecentZip, destinationPath);
    } catch (error) {
        console.error('Error unzipping file:', error);
        return
    }
    console.log('File unzipped successfully:', mostRecentZip);

    const directory = 'C:/Users/gavin/Downloads/unzipped/Takeout/Fit/Activities'
    const files = await fs.promises.readdir(directory);
    const lastReadTimestampPath = path.join(__dirname, '../data/lastReadGPX.txt')
    const lastReadTimestamp = fs.readFileSync(lastReadTimestampPath, 'utf8') as string

    const newFiles = files
        .map(file => [file, file.slice(0, 19)] as const)
        .filter(file =>
            //more recent than recorded
            file[1].localeCompare(lastReadTimestamp) > 0 &&
            HeartRateIntervalIsOne(fs.readFileSync(path.join(directory, file[0]), 'utf8') as string)
        )
        .Log()

    if (newFiles.length > 0)
        fs.writeFileSync(lastReadTimestampPath, newFiles.at(-1)![1])

    files.forEach(file => {
        if (!newFiles.map(f => f[0]).includes(file))
            fs.rmSync(path.join(directory, file))
    })
}