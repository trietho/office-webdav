import App from './app';
import { FilesRouter } from './files-router'

const app = new App(
  [
    new FilesRouter()
  ],
  process.env.PORT || 3000,
);
 
app.listen();