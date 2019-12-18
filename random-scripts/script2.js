const fs = require("fs");
const { pack, unpack } = require("..");
const hash = require("object-hash");

const myJSON2 = JSON.parse(fs.readFileSync("foo.json"));

console.time("packing");
let packed;
for(let i = 0; i < 1000; i++) {
  packed = pack(myJSON2, {
    deleteNulls: true,
    extractKeys: new Set(["sections", "authors"]),
    deleteKeys: new Set(["created-at", "updated-at", "menu-group-id"]),
    hashingFunction: (key, value) => {
      if (key === "sections" && value && typeof value === "object" && value.id) {
        return `sec-${value.id}`;
      } else if (key === "authors" && value && typeof value === "object" && value.id) {
        return `aut-${value.id}-${value["contributor-role"]}`
      } else {
        return hash(value, { encoding: 'base64' }).substring(0, 5);
      }
    }
  });
}
console.timeEnd("packing");

console.time("unpacking");
for (let i = 0; i < 1000; i++) {
  unpack(packed);
}
console.timeEnd("unpacking");
