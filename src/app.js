import Express from 'express';
import engine from 'express-dot-engine';
import http from 'http';
import cors from 'cors';

/* Internal Modules */
import productList from './app/views/listpage';

// create an express app
const app = new Express();

// set file extensions
app.engine('html', engine.__express);
// set view directory
app.set('views', __dirname + '/app/views');
// set template engine
app.set('view engine', 'dot');
// modify default settings
// doT settings
engine.settings.dot = {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname:     'layout, partial, locals, model',
    strip: false,
    append: true,
    selfcontained: false,
};
/* Enable CORS for each route */
app.use(cors());
    
/* SET AMP SAME ORIGIN HEADER FOR EACH REQUEST */
app.use((req, res, next) => {
    req.headers['amp-same-origin'] = 'true';
    assertCors(req, res, ['GET']);
    next();
});

// Route for list Page
app.get('/amp/list', (req, res, next) => {
    console.log("request for list page");
    productList(req, res, next);
});

// Handling for route not found
app.get('*', (req, res) => {
    console.info('View not found for ', req.url);
    res.send("Page not found");
    res.end();
    // renderErrorPage(req, res);
});

//create a http server
var server = http.createServer(app);

server.listen(7000, (error) => {
    if (error) {
        console.error('Error while starting node server', error)
    } else {
        console.info('Node Server Listening on port', server.address().port);
    }
});

function enableCors(req, res, origin, opt_exposeHeaders) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Expose-Headers',
        ['AMP-Access-Control-Allow-Source-Origin']
            .concat(opt_exposeHeaders || []).join(', '));
    if (req.query.__amp_source_origin) {
        res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
    }
}

function getUrlPrefix(req) {
    return req.protocol + '://' + req.headers.host;
}  

function assertCors(req, res, opt_validMethods, opt_exposeHeaders,opt_ignoreMissingSourceOrigin) {
    // Allow disable CORS check (iframe fixtures have origin 'about:srcdoc').
    if (req.query.cors == '0') {
      return;
    }
  
    const validMethods = opt_validMethods || ['GET', 'POST', 'OPTIONS'];
    const invalidMethod = req.method + ' method is not allowed. Use POST.';
    const invalidOrigin = 'Origin header is invalid.';
    const invalidSourceOrigin = '__amp_source_origin parameter is invalid.';
    const unauthorized = 'Unauthorized Request';
    let origin;
  
    if (validMethods.indexOf(req.method) == -1) {
      res.statusCode = 405;
      res.end(JSON.stringify({message: invalidMethod}));
      throw invalidMethod;
    }
  
    if (req.headers.origin) {
      origin = req.headers.origin;
      if (!ORIGIN_REGEX.test(req.headers.origin)) {
        res.statusCode = 500;
        res.end(JSON.stringify({message: invalidOrigin}));
        throw invalidOrigin;
      }
  
      if (!opt_ignoreMissingSourceOrigin &&
          !SOURCE_ORIGIN_REGEX.test(req.query.__amp_source_origin)) {
        res.statusCode = 500;
        res.end(JSON.stringify({message: invalidSourceOrigin}));
        throw invalidSourceOrigin;
      }
    } else if (req.headers['amp-same-origin'] == 'true') {
      origin = getUrlPrefix(req);
    } else {
      res.statusCode = 401;
      res.end(JSON.stringify({message: unauthorized}));
      throw unauthorized;
    }
  
    enableCors(req, res, origin, opt_exposeHeaders);
}

process.on("unhandledRejection", function(err) {
    console.error("UnhandledRejection error" + err);
});

process.on('uncaughtException', function(error) {
    console.error("uncaughtException " + error);
    console.error("trace");
    console.error(error.stack);
});