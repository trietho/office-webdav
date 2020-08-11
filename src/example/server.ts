import App from './app';
import { FilesRouter } from './files-router'
import { FilesRouter2 } from './files-router2';

const app = new App(
  [
    new FilesRouter(),
    new FilesRouter2()
  ],
  process.env.PORT || 3000,
);
 
app.listen();