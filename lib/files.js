// The lib/ folder contains both browser code and Node.js code. When Webpack
// generates browser code, it doesn't know which function or files that sould be
// included into the browser code, so it takes everything. And since 'path' and
// 'fs' that are Node.js only, we get the following error when Webpack does its
// thing:
//
//   TypeError: fs__WEBPACK_IMPORTED_MODULE_0___default(...).readFileSync is
//   not a function
//
// Our workaround is to tell Webpack to not try to include the functions from
// the 'fs' and 'path' modules. The code below still gets into the browser code,
// but we hope that it won't get called (it won't, don't worry). To tell Webpack
// to not include the functions from the 'fs' and 'path' modules, we set the
// following in package.json:
//
//   "browser": {
//     "fs": false,
//     "path": false
//   }

import fs from 'fs'
import stdpath from 'path'

export function getRawFile(path) {
  const rootPath = process.env.DOCS_PATH ? process.env.DOCS_PATH : 'content'
  const filePath = stdpath.join(process.cwd(), rootPath, path)
  return fs.readFileSync(filePath, 'utf8')
}
