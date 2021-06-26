"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { configureFitbitApp } from './fitbitapp';
const fitbitapp_1 = require("../../src/fitbitapp");
const serverless = require('serverless-http');
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
// const binaryMimeTypes: string[] = [
//   // 'application/javascript',
//   // 'application/json',
//   // 'application/octet-stream',
//   // 'application/xml',
//   // 'font/eot',
//   // 'font/opentype',
//   // 'font/otf',
//   // 'image/jpeg',
//   // 'image/png',
//   // 'image/svg+xml',
//   // 'text/comma-separated-values',
//   // 'text/css',
//   // 'text/html',
//   // 'text/javascript',
//   // 'text/plain',
//   // 'text/text',
//   // 'text/xml',
// ];
const app = fitbitapp_1.configureFitbitApp();
//const server = createServer(app, undefined, binaryMimeTypes);
exports.http = serverless(app);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml0Yml0TGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZml0Yml0TGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esb0RBQW9EO0FBQ3BELG1EQUF5RDtBQUN6RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUU3QywrRUFBK0U7QUFDL0UsZ0ZBQWdGO0FBQ2hGLGdGQUFnRjtBQUNoRixrRUFBa0U7QUFDbEUsc0NBQXNDO0FBQ3RDLGlDQUFpQztBQUNqQywyQkFBMkI7QUFDM0IsbUNBQW1DO0FBQ25DLDBCQUEwQjtBQUMxQixtQkFBbUI7QUFDbkIsd0JBQXdCO0FBQ3hCLG1CQUFtQjtBQUNuQixxQkFBcUI7QUFDckIsb0JBQW9CO0FBQ3BCLHdCQUF3QjtBQUN4QixzQ0FBc0M7QUFDdEMsbUJBQW1CO0FBQ25CLG9CQUFvQjtBQUNwQiwwQkFBMEI7QUFDMUIscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIsS0FBSztBQUNMLE1BQU0sR0FBRyxHQUFHLDhCQUFrQixFQUFFLENBQUM7QUFDakMsK0RBQStEO0FBRWxELFFBQUEsSUFBSSxHQUFZLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQSJ9