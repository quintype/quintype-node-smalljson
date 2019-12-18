const fs = require("fs");

function accumulateSize(acc, object) {
  if(typeof object === 'string') {
    return object.length + 2;
  } else if (typeof object === 'number') {
    return object.toString().length;
  } else if (Array.isArray(object)) {
    // [] + commas + items
    return 2 + (object.length - 1) + object.reduce((sum, o) => sum + accumulateSize(acc, o), 0)
  } else if (typeof object === 'boolean') {
    return object.toString().length;
  } else if (object === null) {
    return 4;
  } else if (typeof object === 'object') {
    const entries = Object.entries(object);
    // {} + commas + items
    return 2 + (entries.length - 1) + entries.reduce((sum, [key, value]) => {
      const size = accumulateSize(acc, value);
      acc[key] = (acc[key] || 0) + size;
      // "", + key + value
      return sum + 3 + key.length + size;
    }, 0)
  } else {
    throw new Error(`unknown type, ${typeof object}`);
  }
}

function compare([_a, aSize], [_b, bSize]) {
  if (aSize < bSize) {
    return -1;
  }
  if (aSize > bSize) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

const acc = {};
const json = JSON.parse(fs.readFileSync("foo.json"));

console.log(accumulateSize(acc, json));
Object.entries(acc)
.sort(compare)
.forEach(([key, size]) =>
  console.log(`${key} - ${size}`)
)
