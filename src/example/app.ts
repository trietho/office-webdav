import * as express from 'express';
import * as bodyParser from 'body-parser';
 
class App {
  public app: express.Application;
  public port: number;
 
  constructor(routers: any, port: any) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares();
    this.initializerouters(routers);
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
  }
 
  private initializerouters(routers: any) {
    routers.forEach((router: any) => {
        console.log('mapping: ' + router.route)
      this.app.use(router.route, router.handler);
    });
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;