const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const csvfile = 'rfid.csv';
fs.createReadStream(csvfile)
.pipe(csv())
.on('data', (data) => results.push(data))
.on('end', () => {
    console.log(results);
})

