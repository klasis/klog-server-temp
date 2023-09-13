import Koa from 'koa';
import logger from 'koa-logger';
import router from './routes/index.js';
// import swagger from './swagger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';
import fs from 'fs';

const app = new Koa();

/* setup middlewares */
app.proxy = true;
// logger
app.use(logger());
// router
app.use(router.routes()).use(router.allowedMethods());

const { version } = JSON.parse(fs.readFileSync('./package.json'));
app.use((ctx, next) => {
    if (ctx.path === '/api/v2/docs.json') {
        const swaggerSpec = swaggerJsdoc({
            failOnErrors: true,
            definition: {
                openapi: '3.1.0',
                info: {
                    title: 'KLOG API DOCS',
                    description: 'This page is api-docs for KLOG.',
                    // termsOfService: 'https://www.klasis.com/terms',
                    // contact: {
                    //     name: 'API Support',
                    //     url: 'https://www.klasis.com/support',
                    //     email: 'support@klasis.com'
                    // },
                    // license: {
                    //     name: "MIT License",
                    //     identifier: 'MIT-License',
                    //     url: "https://www.klasis.com/licenses"
                    // },
                    version: version
                }
            },
            apis: [
                './routes/*.js',
                './routes/**/*.js',
                './routes/**/**/*.js',
                './routes/**/**/**/*.js'
            ]
        });

        ctx.set('Content-Type', 'application/json');
        ctx.body = swaggerSpec;
    }

    return next();
});

app.use(
    koaSwagger({
        title: 'KLOG - API DOCS',
        oauthOptions: {},
        swaggerOptions: {
            url: '/api/v2/docs.json',
            supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
            docExpansion: 'none',
            jsonEditor: false,
            defaultModelRendering: 'schema',
            showRequestHeaders: false,
            swaggerVersion: '5.9.0',
            validatorUrl: null
        },
        routePrefix: '/api/docs',
        specPrefix: '',
        exposeSpec: false,
        hideTopbar: true,
        // favicon: '/favicon.png',
        // customCSS: ``
    })
);

export default app;