const path = require('path');
const fs = require('fs');

const deleteFile = (folderName, fileName) => {
  if (!fileName) return;

  // Resolve from project root, not __dirname
  const filePath = path.resolve(folderName, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete (${fileName}) :`, err);
    } else {
      console.log(`File ${fileName} deleted successfully`);
    }
  });
};

module.exports = deleteFile;
