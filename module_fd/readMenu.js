const fs = require("fs/promises");
const path = require("path");

async function readMenu() {
    const filePath = path.join(__dirname, "../data_fd/menu.json");

    const data = await fs.readFile(filePath, "utf8");

    return JSON.parse(data);
}

module.exports = readMenu;