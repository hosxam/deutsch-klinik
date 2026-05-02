let fs = require("fs");
let path = require("path");

let batchFile = path.join(__dirname, "..", "data", "fspReading-batch5-final.json");

// We already have batch5-part1.json with r81-r93 (truncated).
// Let's read what we have and continue with the rest.

let part1 = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "batch5-part1.json"), "utf8"));
fs.writeFileSync(batchFile, JSON.stringify(part1, null, 2) + ",");
console.log("Part1 length:", part1.length);
