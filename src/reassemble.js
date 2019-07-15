const fs = require('fs').promises;

const DIR =  './input/';


assemble();
async function assemble() {
  Promise.resolve({})
    .then(getFiles)
    .then(getExtension)
    .then(tidy)
    .then(getBuffers)
    .then(combineBuffers)
    .then(exportBuffer)
    .then(cleanup)
    .catch(err => console.log(err));
}

async function getFiles(thru) {
  //Get a list of the filenames in the input directory
  thru.fileNames = await fs.readdir(DIR)
     .catch(err => console.log(err));

  //Throw an error if there are no files in the input folder
  if (!thru.fileNames || thru.fileNames.length == 0) {
    throw new Error('No input files detected');
  }

  //Return the result wrapped in thru
  return thru;
}

async function getExtension(thru) {
  //Store the extension of the file being assembled
  thru.name = await fs.readFile(DIR + 'name', 'utf-8')
    .catch(err => {throw err;});

  //Return the extension wrapped in thru
  return thru;
}

async function tidy(thru) {
  //Remove extraneous non-numbered files from the fileNames pool
  thru.fileNames = thru.fileNames
    .filter(x => Number.isInteger(parseInt(x)))
    .sort((a, b) => parseInt(a) > parseInt(b));

  //Returns the new list of just the original data files wrapped in thru
  return thru;
}

async function getBuffers(thru) {
  //Load the listed files into buffers
  thru.files = await Promise.all(thru.fileNames
    .map(name =>
      fs.readFile(DIR + name)
        .catch(err => {throw err;})
    )
  );

  //Return the buffers wrapped in thru
  return thru;
}

async function combineBuffers(thru) {
  //Concatenate all the file buffers into one, preserving order
  thru.file = await Promise.resolve(Buffer.concat(thru.files));

  //Return the new file buffer wrapped in thru
  return thru;
}

async function exportBuffer(thru) {
  //Write the combined file to the output directory
  await fs.writeFile(DIR + (thru.name ? thru.name : 'unnamed'), thru.file)
    .catch(err => {throw err;});

  //Return the rest wrapped in thru
  return thru;
}

async function cleanup(thru) {
  //Clean out the input folder of data files
  thru.fileNames.forEach(cur =>
    fs.unlink(DIR + cur)
      .catch(err => {throw err;})
  );

  //Remove the name file if it exists
  if (thru.name) {
    fs.unlink(DIR + 'name')
      .catch(err => {throw err;});
  }
}
