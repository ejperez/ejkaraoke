import {
  copyFile,
  mkdir,
  readdir,
  rename,
  rm,
  rmdir,
  stat,
  unlink,
} from "node:fs/promises";
import { constants, randomInt } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DOWNLOAD_DIR } from "../dist/config.js";
import { VIDEO_DIR_DELIMITER } from "../dist/video-constants.js";

const VIDEO_ID_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const VIDEO_ID_LENGTH = 11;
const MAX_ID_ATTEMPTS = 100;

export function generateImportedVideoId() {
  let id = "IMP";

  for (let index = 0; index < VIDEO_ID_LENGTH; index += 1) {
    id += VIDEO_ID_ALPHABET[randomInt(VIDEO_ID_ALPHABET.length)];
  }

  return id;
}

async function moveFile(sourcePath, destinationPath) {
  try {
    await rename(sourcePath, destinationPath);
  } catch (error) {
    if (error.code !== "EXDEV") throw error;

    await copyFile(sourcePath, destinationPath, constants.COPYFILE_EXCL);
    try {
      await unlink(sourcePath);
    } catch (unlinkError) {
      try {
        await rm(destinationPath);
      } catch (cleanupError) {
        throw new AggregateError(
          [unlinkError, cleanupError],
          `Could not remove the source or clean up the copied file: ${sourcePath}`,
        );
      }
      throw unlinkError;
    }
  }
}

async function moveIntoUniqueDirectory(
  sourcePath,
  fileName,
  downloadDirectory,
  reservedIds,
  idGenerator,
) {
  for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
    const id = idGenerator();
    if (reservedIds.has(id)) continue;

    const destinationDirectory = path.join(
      downloadDirectory,
      `${id}${VIDEO_DIR_DELIMITER}`,
    );

    try {
      await mkdir(destinationDirectory);
    } catch (error) {
      if (error.code === "EEXIST") continue;
      throw error;
    }
    reservedIds.add(id);

    const destinationPath = path.join(destinationDirectory, fileName);
    try {
      await moveFile(sourcePath, destinationPath);
    } catch (error) {
      try {
        await rm(destinationPath, { force: true });
        await rmdir(destinationDirectory);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          `Could not move ${sourcePath} or clean up its destination`,
        );
      }
      throw error;
    }

    return id;
  }

  throw new Error(
    `Could not generate a unique ID for ${fileName} after ${MAX_ID_ATTEMPTS} attempts.`,
  );
}

export async function importVideos(
  sourceDirectory,
  downloadDirectory = DOWNLOAD_DIR,
  idGenerator = generateImportedVideoId,
) {
  const sourcePath = path.resolve(sourceDirectory);
  const sourceStats = await stat(sourcePath);
  if (!sourceStats.isDirectory()) {
    throw new Error(`Source path is not a directory: ${sourcePath}`);
  }

  const resolvedDownloadDirectory = path.resolve(downloadDirectory);
  await mkdir(resolvedDownloadDirectory, { recursive: true });
  const existingDirectories = await readdir(resolvedDownloadDirectory, {
    withFileTypes: true,
  });
  const reservedIds = new Set(
    existingDirectories
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.split(VIDEO_DIR_DELIMITER, 1)[0])
      .filter(Boolean),
  );

  const files = (await readdir(sourcePath, { withFileTypes: true }))
    .filter(
      (entry) =>
        entry.isFile() && path.extname(entry.name).toLowerCase() === ".mp4",
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No .mp4 files found in ${sourcePath}`);
  }

  const imported = [];
  for (const fileName of files) {
    const id = await moveIntoUniqueDirectory(
      path.join(sourcePath, fileName),
      fileName,
      resolvedDownloadDirectory,
      reservedIds,
      idGenerator,
    );
    imported.push({ id, fileName });
  }

  return imported;
}

async function main() {
  const sourceDirectory = process.argv[2];
  if (!sourceDirectory || process.argv.length !== 3) {
    throw new Error("Usage: npm run import-videos -- <source-directory>");
  }

  const imported = await importVideos(sourceDirectory);
  for (const { id, fileName } of imported) {
    console.log(`Imported ${fileName} as ${id}`);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
