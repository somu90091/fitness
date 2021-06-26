"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleApp_1 = require("../../src/googleApp");
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
const app = googleApp_1.configureGoogleApp();
//const server = createServer(app, undefined, binaryMimeTypes);
exports.handler = serverless(app);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlTGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ29vZ2xlTGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsbURBQXlEO0FBQ3pELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRTdDLCtFQUErRTtBQUMvRSxnRkFBZ0Y7QUFDaEYsZ0ZBQWdGO0FBQ2hGLGtFQUFrRTtBQUNsRSxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLDJCQUEyQjtBQUMzQixtQ0FBbUM7QUFDbkMsMEJBQTBCO0FBQzFCLG1CQUFtQjtBQUNuQix3QkFBd0I7QUFDeEIsbUJBQW1CO0FBQ25CLHFCQUFxQjtBQUNyQixvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLHNDQUFzQztBQUN0QyxtQkFBbUI7QUFDbkIsb0JBQW9CO0FBQ3BCLDBCQUEwQjtBQUMxQixxQkFBcUI7QUFDckIsb0JBQW9CO0FBQ3BCLG1CQUFtQjtBQUNuQixLQUFLO0FBQ0wsTUFBTSxHQUFHLEdBQUcsOEJBQWtCLEVBQUUsQ0FBQztBQUNqQywrREFBK0Q7QUFFbEQsUUFBQSxPQUFPLEdBQVksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDIn0=