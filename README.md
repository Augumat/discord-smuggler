# Summary
A simple node script that can be used to send and receive files larger than Discord's 8 Megabyte maximum upload size without Nitro.

No compression is used so the whole process is lossless.



# Usage
First, put the file you want to unwrap or the collection of files you want to reassemble into the input folder.
Then do the OS specific action to launch.

(NOTE) The original file(s) **WILL BE DELETED** and replaced with the newly converted file(s).

After that you're good to go!

## Windows
Run the relevant batch script in the main folder.

## Mac / Linux
Simply run the command `node ./src/disassemble.js` to disassemble or `node ./src/reassemble.js` to reassemble.
