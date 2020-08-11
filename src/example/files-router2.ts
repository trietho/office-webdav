import * as express from 'express';
import { OfficeWebDavRouter } from '../modules/office-webdav';
import * as fs from 'fs';

export class FilesRouter2 {
    public route = "/files2"
    
    public handler = express.Router()
    
    constructor() {
        this.handler.use(OfficeWebDavRouter(this))
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

