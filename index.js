import { YtDlp } from 'ytdlp-nodejs';

const ytdlp = new YtDlp();

// Fluent builder API (recommended)
const result = await ytdlp
  .download('https://youtube.com/watch?v=dQw4w9WgXcQ')
  .format({ filter: 'mergevideo', quality: '720p', type: 'mp4' })
  .output('./downloads')
  .embedThumbnail()
  .on('progress', (p) => console.log(`${p.percentage_str}`))
  .run();

console.log('Files:', result.filePaths);