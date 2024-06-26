import { ZipReaderStream } from "jsr:@zip-js/zip-js@2.7.45";
import { resolve } from "jsr:@std/path@0.225.2";
import { ensureDir, ensureFile } from "jsr:@std/fs@0.229.3";

// Available from https://fontsource.org/fonts/poppins
// The download endpoint is undocumented! Warning!
const response = await fetch("https://api.fontsource.org/v1/download/poppins");

// Create a ZipReaderStream to extract the file
const zipStream = response.body!.pipeThrough(new ZipReaderStream());

// Set the target destination
const destination = "src/assets/fonts";

// Iterate over every entry in the zip stream
for await (const entry of zipStream) {
  // Work out the local file name
  const fullPath = resolve(destination, entry.filename);

  // Create directories if they need to exist
  if (entry.directory) {
    console.log(`Creating ${fullPath}...`);
    await ensureDir(fullPath);
    continue;
  }

  console.log(`Unpacking ${fullPath}...`);
  // Create the file...
  await ensureFile(fullPath);
  // ... and stream the contents of the zip file entry to it
  await entry.readable?.pipeTo((await Deno.create(fullPath)).writable);
}
