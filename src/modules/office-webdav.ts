import * as express from 'express'
import { v4 as uuidv4 } from 'uuid';
import { exception } from 'console';

export abstract class OfficeWebDavBase {

    public handler = express.Router();
    abstract getFile(req: express.Request, res: express.Response, next: express.NextFunction): any;
    abstract putFile(req: express.Request, res: express.Response, next: express.NextFunction): any;

    constructor() {
        this.handler.use(OfficeWebDavMiddleware);
    }

    public intializeRoutes() {
        this.handler.lock(["/:filename", "/:sessionid/:filename"], this.lockFile)
        this.handler.head(["/", "/:filename", "/:sessionid/:filename"], this.head)
        this.handler.options(["/", "/:filename", "/:sessionid/:filename"], this.options)
        this.handler.unlock(["/:filename", "/:sessionid/:filename"], this.unlock)
        this.handler.put(["/:filename", "/:sessionid/:filename"], this.putFile)
        this.handler.get(["/:filename", "/:sessionid/:filename"], this.getFile)
    }

    lockFile(req: express.Request, res: express.Response, next?: express.NextFunction) {
        var lockToken = uuidv4()
        res.setHeader('Content-Type', "application/xml; charset=utf-8")
        res.setHeader('Lock-Token', lockToken);
        res.send(lockFileXML(lockToken, getRequestUrl(req)))
    }

    options(req: express.Request, res: express.Response, next?: express.NextFunction) {
        res.sendStatus(200)
    }

    unlock(req: express.Request, res: express.Response, next?: express.NextFunction) {
        res.sendStatus(200)
    }

    head(req: express.Request, res: express.Response, next?: express.NextFunction) {
        res.sendStatus(200)
    }

}

export function OfficeWebDavRouter(handler?: any): express.Router {
    var router = express.Router()
    router.use(OfficeWebDavMiddleware);
    router.head(["/", "/:filename", "/:sessionid/:filename"], handler?.head || function (req: express.Request, res: express.Response) { res.sendStatus(200) })
    router.options(["/", "/:filename", "/:sessionid/:filename"], handler?.options || function (req: express.Request, res: express.Response) { res.sendStatus(200) })
    router.unlock([ "/:filename", "/:sessionid/:filename"], handler?.unlock || function (req: express.Request, res: express.Response) { res.sendStatus(200) })

    router.lock([ "/:filename", "/:sessionid/:filename"], handler?.lock ||
        function (req: express.Request, res: express.Response) {
            var lockToken = uuidv4()
            res.setHeader('Content-Type', "application/xml; charset=utf-8")
            res.setHeader('Lock-Token', lockToken);

            res.send(lockFileXML(lockToken, getRequestUrl(req)))
        })
    router.put([ "/:filename", "/:sessionid/:filename"], handler?.putFile || function (req: express.Request, res: express.Response) { throw new Error("Method not implemented.") })
    router.get([ "/:filename", "/:sessionid/:filename"], handler?.getFile || function (req: express.Request, res: express.Response) { throw new Error("Method not implemented.") })

    return router;
}

function lockFileXML(lockToken: string, fileUrl: string, author = "Anonymous", timeout = 3600): string {
    var responseXML = `
                <?xml version="1.0" encoding="utf-8?">
                <D:prop xmlns:D="DAV:">
                    <D:lockdiscovery>
                        <D:activelock>
                            <D:locktype>
                                <write/>
                            </D:locktype>
                            <D:lockscope>
                                <exclusive/>
                            </D:lockscope>
                            <D:locktoken>
                                <D:href>urn:uuid:${lockToken}</D:href>
                            </D:locktoken>
                            <D:lockroot>
                                <D:href>${fileUrl}</D:href>
                            </D:lockroot>
                            <D:depth>infinity</D:depth>
                            <D:owner>
                                <a:href xmlns:a="DAV:">${author}</a:href>
                            </D:owner>
                            <D:timeout>Second-${timeout}</D:timeout>
                        </D:activelock>
                    </D:lockdiscovery>
                </D:prop>`

    return responseXML;
}

function getRequestUrl(req: any) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

export function OfficeWebDavMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

    res.setHeader("dav", "1,2");
    res.setHeader("www-authenticate", "Anonymous");
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-credentials", "true");
    res.setHeader("ms-author-via", "DAV");
    res.setHeader("access-control-expose-headers", "DAV, content-length, Allow");
    //context.HttpContext.Response.Headers.Add("allow", "PROPPATCH,PROPFIND,OPTIONS,DELETE,UNLOCK,COPY,LOCK,MOVE,HEAD,POST,PUT,GET");
    res.setHeader("allow", "OPTIONS,UNLOCK,LOCK,HEAD,PUT,GET");
    next();
}
