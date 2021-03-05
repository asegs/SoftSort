const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(createProxyMiddleware('/emailvalidate/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/companyvalidate/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/users', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/adddataset', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/isprivate/*/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/datasetlogin/*/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/getsizes/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/verifyemail/*', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/change', { target: 'http://localhost:5000/' }));
    app.use(createProxyMiddleware('/softsort/*', { target: 'http://localhost:8080/' }));
    app.use(createProxyMiddleware('/softsort/*/*', { target: 'http://localhost:8080/' }));
    app.use(createProxyMiddleware('/softsort/*/*/*', { target: 'http://localhost:8080/' }));
    app.use(createProxyMiddleware('/query', { target: 'http://localhost:8081/' }));
    app.use(createProxyMiddleware('/firstlines', { target: 'http://localhost:8081/' }));
    app.use(createProxyMiddleware('/merge', { target: 'http://localhost:8081/' }));
}
