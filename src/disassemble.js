const fs = require('fs').promises;

const CHUNK_SIZE = 50000000;

const inputDir =  './input/';
const outputDir = './input/';



disassemble();
async function disassemble() {

  //Grab the name of all files in the input folder
  let fileNames = await fs.readdir(inputDir)
    .catch(err => console.log(err));

  //Catch failure conditions
  if (!fileNames || fileNames.length == 0) {
    console.log('ERROR : No input file detected');
    return;
  }
  if (fileNames.length > 1) {
    console.log('ERROR : Too many input files, choose only one');
    return;
  }

  //Grab the name of the only file in the input folder
  let fileName = fileNames[0];

  //Grab the file extension of the input file
  let extension = fileName.split('.');
  extension = extension[extension.length - 1];

  //Split and export the file
  await fs.readFile(inputDir + fileName)
    .then(data => chunk(data).forEach(write))
    .catch(err => console.log(err));

  //Export the extension
  await fs.writeFile(outputDir + 'ext', extension)
    .catch(err => console.log(err));

  //Clean up the input file
  fs.unlink(inputDir + fileName)
    .catch(err => console.log(err))
}



function chunk(buf) {
  let out = [];
  while (buf.length > CHUNK_SIZE) {
    out.push(buf.slice(0, CHUNK_SIZE));
    buf = buf.slice(CHUNK_SIZE);
  }
  out.push(buf);
  return out;
}

let chunkNumber = 0;
function write(dat) {
  fs.writeFile(outputDir + chunkNumber++, dat)
    .catch(err => console.log(err));
}
