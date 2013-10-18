![status](https://secure.travis-ci.org/robrich/arranger.png?branch=master)

Arranger
========

A module for sequencing tasks and dependencies

Usage
-----

```javascript
var sequence = require('arranger');

var items = {
  a: {
    name: 'a',
    dep: []
    // other properties as needed
  },
  b: {
    name: 'b',
    dep: ['a']
  },
  c: {
    name: 'c',
    dep: ['a']
  },
  d: {
    name: 'd',
    dep: ['c']
  },
};

var names = ['d', 'b', 'c', 'a']; // The names of the items you want arranged, need not be all

var results = [];

sequence(items, names, results);

console.log(results);
// ['a','b','c','d'];
```

LICENSE
-------

(MIT License)

Copyright (c) 2013 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
