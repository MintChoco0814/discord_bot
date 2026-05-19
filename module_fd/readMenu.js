const fs = require("fs").promises;

async function readMenu() {
    const data = await fs.readFile("../data_fd/menu.json", "utf-8");
    return JSON.parse(data);
}

module.exports = readMenu;