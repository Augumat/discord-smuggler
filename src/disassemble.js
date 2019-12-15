const fs = require('fs').promises;

const CHUNK_SIZE = 8387584; // 8MB - 1024B
const DIR =  './input/';



disassemble();
function disassemble() {
  Promise.resolve({})
    .then(getFiles)
    .then(getBuffer)
    .then(splitBuffer)
    .then(parseName)
    .then(exportBuffers)
    .then(exportName)
    .then(cleanup)
    .catch(err => console.log(err));
}



async function getFiles(thru) {
  //Get a list of the filenames in the input directory
  let fileNames = await fs.readdir(DIR)
     .catch(err => {throw err;});
  //Throw an error if there are no files in the input folder
  if (!fileNames || fileNames.length == 0) {
    throw new Error('No input files detected');
  }
  //Throw an error if there are too many files in the input folder
  if (fileNames.length > 1) {
    throw new Error('Too many input files');
  }
  //Return the single filename wrapped in thru
  thru.fileName = fileNames[0];
  return thru;
}

async function getBuffer(thru) {
  //Grabs the input file as a buffer and saves it
  thru.file = await fs.readFile(DIR + thru.fileName)
    .catch(err => console.log(err));
  //Returns the buffer wrapped in thru
  return thru;
}

async function splitBuffer(thru) {
  //Split the input file into manageable chunks of size CHUNK_SIZE
  thru.files = [];
  while (thru.file.length > CHUNK_SIZE) {
    thru.files.push(thru.file.slice(0, CHUNK_SIZE));
    thru.file = thru.file.slice(CHUNK_SIZE);
  }
  thru.files.push(thru.file);
  //Return the newly chunked files wrapped in thru
  return thru;
}

async function parseName(thru) {
  //Convert the filename to a utf8 byte array
  thru.nameFile = Buffer.from(
    thru.fileName
      .split('')
      .map(x => x.charCodeAt(0))
  );
  //Returns the name as a byte array wrapped in thru
  return thru;
}

async function exportBuffers(thru) {
  //Save chunks and name them in order
  let chunkNumber = 0;
  await Promise.all(thru.files.map(x =>
    fs.writeFile(DIR + chunkNumber++, x)
      .catch(err => {throw err;})
  ));
  //Return the rest wrapped in thru
  return thru;
}

async function exportName(thru) {
  //Save the utf-8 encoded filename to the 'name' file
  await fs.writeFile(DIR + 'name', thru.nameFile)
    .catch(err => {throw err;});
  //Return the rest wrapped in thru
  return thru;
}

async function cleanup(thru) {
  //Unlink the input file
  fs.unlink(DIR + thru.fileName)
    .catch(err => {throw err;});
}
