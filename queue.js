// npm install express better-queue better-queue-sqlite

import express from 'express';
import Queue from 'better-queue';
import SqliteStore from 'better-queue-sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const DB_PATH = path.join(__dirname, 'queue.db');

// Ensure directories exist
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// 1. Initialize SQLite-backed Queue
// This will automatically create 'queue.db' in your project folder
const videoQueue = new Queue(async (task, cb) => {
  const { videoUrl, filename } = task;
  const outputPath = path.join(DOWNLOAD_DIR, filename);

  console.log(`[Worker] Starting download: ${videoUrl}`);

  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

    const fileStream = fs.createWriteStream(outputPath);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length') || 0;
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fileStream.write(Buffer.from(value));
      receivedLength += value.length;

      if (contentLength) {
        const percentage = Math.round((receivedLength / contentLength) * 100);
        // Better-queue lets us report progress easily via the callback context
        // task.id is accessible inside the worker
      }
    }

    fileStream.end();
    console.log(`[Worker] Finished. Saved to ${outputPath}`);
    
    // Success: return data back to the store
    cb(null, { localPath: outputPath, filename });
  } catch (err) {
    console.error(`[Worker] Error downloading file: ${err.message}`);
    // Failure: passes error back
    cb(err);
  }
}, {
  // Configuration options
  concurrent: 1, // Process 1 download at a time to prevent choking local disk/network
  maxRetries: 3,  // Automatically retry 3 times if it fails
  retryDelay: 5000, // Wait 5 seconds before retrying
  store: new SqliteStore({
    path: DB_PATH // Persist queue state to your local SQLite file
  })
});

// 2. Setup Express API
const app = express();
app.use(express.json());

// Dictionary to track live task states memory-side for easy API querying
// (Since better-queue-sqlite handles persistence, we query the queue directly)
app.post('/api/downloads', (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) return res.status(400).json({ error: 'videoUrl is required' });

  const filename = `download-${Date.now()}.mp4`;

  // Push task to SQLite queue
  const ticket = videoQueue.push({ videoUrl, filename });

  // Respond immediately with the Ticket/Job ID
  return res.status(202).json({
    message: 'Download enqueued in SQLite',
    jobId: ticket.id
  });
});

// Check download status directly from the SQLite store
app.get('/api/downloads/:id', (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  
  // Query the underlying store for this specific job
  videoQueue.getStats((err, stats) => {
    // Note: better-queue API is slightly lower-level. 
    // For a cleaner query interface, a custom SQLite schema is often used.
  });

  // A more direct way using better-queue's event system or checking the store:
  videoQueue.store.getTask(jobId, (err, task) => {
    if (err || !task) return res.status(404).json({ error: 'Job not found or completed' });
    
    return res.json({
      id: jobId,
      status: 'pending/active',
      taskData: task
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});