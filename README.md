# office-webdav

Add WebDav abilities to your existing Express project to allow MS Office apps (Word, Excel, PowerPoint) open and edit documents directly on web site via url

See github for the full example
## Link examples
ms-word:ofe|u|http://yoursite/yourcontroller/demo.docx

ms-word:ofe|u|http://yoursite/yourcontroller/sessionid/demo.docx

ms-excel:ofe|u|http://yoursite/yourcontroller/demo.xslx

## use OfficeWebDavBase abstract

```js
import * as express from 'express';
import { OfficeWebDavBase } from 'office-webdav';
import * as fs from 'fs';

export class FilesRouter extends OfficeWebDavBase {
    public route = "/files"

    constructor() {
        super()
        this.intializeRoutes();
    }

    
    getFile(req: express.Request, res: express.Response, next: express.NextFunction) {
        var filename = req.params.filename;

        var file = __dirname + '/' + filename;

        if (!fs.existsSync(file))
            return res.sendStatus(404);

        //return content type of docx
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        res.download(file);
    }

    putFile(req: express.Request, res: express.Response, next: express.NextFunction) {

        var filename = req.params.filename;
        var file = __dirname + '/' + filename;
        req.pipe(fs.createWriteStream(file, { encoding: "binary" })).on('finish', ()=>{
            res.sendStatus(200);
        })
    }
}
```

## use OfficeWebDavRouter router

```js
import * as express from 'express';
import { OfficeWebDavRouter } from 'office-webdav';
import * as fs from 'fs';

export class FilesRouter2 {
    public route = "/files2"
    
    public handler = express.Router()
    
    constructor() {
        this.handler.use(OfficeWebDavRouter(this))
    }

    
    getFile(req: express.Request, res: express.Response, next: express.NextFunction) {
        //...
    }

    putFile(req: express.Request, res: express.Response, next: express.NextFunction) {
        //...
    }
}

```

## use with javascript

```js
var express = require('express');
var router = express.Router();
var officeWebDav = require('office-webdav')
var fs = require('fs')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports.getFile = (req, res) => {
  var filename = req.params.filename;

  var file = __dirname + '/' + filename;

  if (!fs.existsSync(file))
      return res.sendStatus(404);

  //return content type of docx
  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.download(file);
}

module.exports.putFile = (req, res) => {

  var filename = req.params.filename;
  var file = __dirname + '/' + filename;
  req.pipe(fs.createWriteStream(file, { encoding: "binary" })).on('finish', ()=>{
      res.sendStatus(200);
  })
}

router.use(officeWebDav.OfficeWebDavRouter(this))

module.exports = router;
```