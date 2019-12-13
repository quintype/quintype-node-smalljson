# quintype-node-smalljson

This project is used to shrink some json responses. The goal of the library is as follows

* Automatically shrink your json by removing things that are repeated. So if a section is repeated 10 times, it will get removed
* Unpacking (SmallJson.parse) should be dependency free, and safe to use on the browser.
* Packing (SmallJson.stringify) should be correct. We will use `object-hash` to ensure that objects get unique identifiers.

ex:

```javascript
const response = SmallJson.stringify(collectionResponse, {
  includeKeys: ['sections', 'story', 'authors']
})

const getResponseBack = SmallJson.parse(response);
```
