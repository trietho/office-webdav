import * as express from 'express';
import { OfficeWebDavBase } from '../modules/office-webdav';
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

