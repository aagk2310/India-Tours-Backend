const fs = require('fs');
const Tour = require('./model/tourModel');
async function importData() {
  fs.readFile('places.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Parse JSON data
    const categories = JSON.parse(data);

    // Insert data into MongoDB
    Tour.insertMany(categories)
      .then(() => {
        console.log('Data successfully imported to MongoDB');
      })
      .catch((error) => {
        console.error('Error importing data:', error);
      });
  });
}

module.exports = importData;
