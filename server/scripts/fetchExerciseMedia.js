// One-time maintenance script: enriches server/data/exercise.js with
// image_urls/instructions sourced from the free-exercise-db dataset
// (https://github.com/yuhonas/free-exercise-db, The Unlicense — public
// domain), and downloads the matched images into client/public/exercises/
// so the app self-hosts them rather than hotlinking GitHub forever.
//
// Run again (`node server/scripts/fetchExerciseMedia.js`) any time new
// exercises are added to server/data/exercise.js.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import exerciseData from "../data/exercise.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_OUT_DIR = path.resolve(
  __dirname,
  "../../client/public/exercises",
);
const DATA_FILE = path.resolve(__dirname, "../data/exercise.js");
const DATASET_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const RAW_IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

async function downloadImage(remotePath, localDir, fileName) {
  const response = await fetch(`${RAW_IMAGE_BASE}/${remotePath}`);
  if (!response.ok) {
    throw new Error(`Failed to download ${remotePath}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(localDir, { recursive: true });
  await writeFile(path.join(localDir, fileName), buffer);
}

async function main() {
  console.log("Fetching free-exercise-db dataset...");
  const response = await fetch(DATASET_URL);
  const dataset = await response.json();
  const byName = new Map(dataset.map((entry) => [entry.name, entry]));

  const enriched = [];
  let matched = 0;
  let skipped = 0;

  for (const exercise of exerciseData) {
    const entry = byName.get(exercise.exercise_name);
    if (!entry) {
      console.log(`  no match: "${exercise.exercise_name}" — leaving as-is`);
      enriched.push(exercise);
      skipped += 1;
      continue;
    }

    const localDir = path.join(IMAGES_OUT_DIR, entry.id);
    const imageUrls = [];
    for (const [index, remotePath] of entry.images.entries()) {
      const fileName = `${index}.jpg`;
      await downloadImage(remotePath, localDir, fileName);
      imageUrls.push(`/exercises/${entry.id}/${fileName}`);
    }

    enriched.push({
      ...exercise,
      image_urls: imageUrls,
      instructions: entry.instructions,
    });
    matched += 1;
    console.log(`  matched: "${exercise.exercise_name}" (${imageUrls.length} images)`);
  }

  console.log(`\nMatched ${matched}, skipped ${skipped}.`);

  const fileContents =
    "const exerciseData = " +
    JSON.stringify(enriched, null, 2) +
    ";\n\nexport default exerciseData;\n";
  await writeFile(DATA_FILE, fileContents);
  console.log(`Wrote ${DATA_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
