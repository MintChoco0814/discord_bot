const fs = require("fs").promises; 

async function readTimeTable() {
    const data = await fs.readFile("../data_fd/timeTable.json", "utf-8");
    return JSON.parse(data);
}

module.exports = readTimeTable;