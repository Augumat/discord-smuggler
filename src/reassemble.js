const fs = require('fs').promises;

const inputDir =  './input/';
const outputDir = './input/';



assemble();
async function assemble() {
  //Grab the names of the component files in the input directory
  let fileNames = await fs.readdir(inputDir)
    .catch(err => console.log(err));

  //Catch failure conditions
  if (!fileNames || fileNames.length == 0) {
    return console.log('ERROR : No input file detected');
  }

  //Store the extension of the file being assembled
  let extension = await fs.readFile(inputDir + 'ext', 'utf-8')
    .catch(err => {
      console.log('ERROR : No file extension found');
      return '';
    });

  //Remove the extension file from the list of files to add to the buffer
  fileNames = fileNames.filter(x => x != 'ext');

  //Put the files themselves into buffers
  let files = await Promise.all(fileNames.map(name =>
    fs.readFile(inputDir + name)
      .catch(err => console.log(err))
  ));

  //Concatenate the files into one
  let file = Buffer.concat(files);

  //Write the combined file to the output directory
  let outputFileName = (extension == '') ? outputDir + 'out' : outputDir + 'out.' + extension;
  await fs.writeFile(outputFileName, file)
    .catch(err => console.log(err));

  //Clean out the input folder
  fileNames.forEach(name =>
    fs.unlink(inputDir + name)
      .catch(err => console.log(err))
  );
  fs.unlink(inputDir + 'ext')
    .catch(err => {});
}
