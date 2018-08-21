"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rx_http_request_1 = require("@akanass/rx-http-request");
var logger_1 = require("./logger");
var config_1 = require("./config");
var restify = require('restify');
var request = require('request');
var fs = require('fs');
var errors = require('restify-errors');
var YAML = require('yamljs');
var logger = logger_1.Logger.getLogger(__filename);
var RestClient = /** @class */ (function () {
    function RestClient(isClient, token, serviceLocatorUri) {
        this.isClient = isClient;
        this.token = token;
        this.serviceLocatorUri = serviceLocatorUri;
        if (!isClient) {
            this.config = new config_1.Config();
            this.serviceLocatorUri = this.config.get(config_1.Config.KEY_URL_INT_SERVICE_LOCATOR);
        }
    }
    RestClient.prototype.getToken = function (username, password) {
        var _this = this;
        return this.getAuthUri().pipe(operators_1.map(function (authUri) { return authUri + '/tokens/'; }), operators_1.mergeMap(function (uri) { return _this.post(uri, _this.getBasicAuthHeader(username, password)); }), operators_1.map(function (data) { return JSON.parse(data); }));
    };
    RestClient.prototype.getStatus = function (host) {
        return this.getJson(host + '/admin/status', this.token);
    };
    RestClient.prototype.getSessions = function () {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.getJson(sessionDbUri + '/sessions/', _this.token); }));
    };
    RestClient.prototype.getSession = function (sessionId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.getJson(sessionDbUri + '/sessions/' + sessionId, _this.token); }));
    };
    RestClient.prototype.postSession = function (session) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.postJson(sessionDbUri + '/sessions/', _this.token, session); }), operators_1.map(function (resp) { return JSON.parse(resp).sessionId; }));
    };
    RestClient.prototype.extractSession = function (sessionId, datasetId) {
        var _this = this;
        return this.getSessionWorkerUri().pipe(operators_1.mergeMap(function (uri) { return _this.postJson(uri + '/sessions/' + sessionId + '/datasets/' + datasetId, _this.token, null); }));
    };
    RestClient.prototype.packageSession = function (sessionId, file) {
        var _this = this;
        return this.getSessionWorkerUri().pipe(operators_1.mergeMap(function (uri) { return _this.getToFile(uri + '/sessions/' + sessionId, file); }));
    };
    RestClient.prototype.deleteSession = function (sessionId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.deleteWithToken(sessionDbUri + '/sessions/' + sessionId, _this.token); }));
    };
    RestClient.prototype.getDatasets = function (sessionId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) {
            return _this.getJson(sessionDbUri + '/sessions/' + sessionId + '/datasets/', _this.token);
        }));
    };
    RestClient.prototype.getDataset = function (sessionId, datasetId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) {
            return _this.getJson(sessionDbUri + '/sessions/' + sessionId + '/datasets/' + datasetId, _this.token);
        }));
    };
    RestClient.prototype.deleteDataset = function (sessionId, datasetId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.deleteWithToken(sessionDbUri + '/sessions/' + sessionId + '/datasets/' + datasetId, _this.token); }));
    };
    RestClient.prototype.postDataset = function (sessionId, dataset) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.postJson(sessionDbUri + '/sessions/' + sessionId + '/datasets/', _this.token, dataset); }), operators_1.map(function (resp) { return JSON.parse(resp).datasetId; }));
    };
    RestClient.prototype.putDataset = function (sessionId, dataset) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.putJson(sessionDbUri + '/sessions/' + sessionId + '/datasets/' + dataset.datasetId, _this.token, dataset); }));
    };
    RestClient.prototype.getJobs = function (sessionId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) {
            return _this.getJson(sessionDbUri + '/sessions/' + sessionId + '/jobs/', _this.token);
        }));
    };
    RestClient.prototype.getJob = function (sessionId, jobId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) {
            return _this.getJson(sessionDbUri + '/sessions/' + sessionId + '/jobs/' + jobId, _this.token);
        }));
    };
    RestClient.prototype.postJob = function (sessionId, job) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.postJson(sessionDbUri + '/sessions/' + sessionId + '/jobs/', _this.token, job); }), operators_1.map(function (resp) { return JSON.parse(resp).jobId; }));
    };
    RestClient.prototype.deleteJob = function (sessionId, jobId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.deleteWithToken(sessionDbUri + '/sessions/' + sessionId + '/jobs/' + jobId, _this.token); }));
    };
    RestClient.prototype.getTools = function () {
        var _this = this;
        return this.getToolboxUri().pipe(operators_1.mergeMap(function (uri) {
            return _this.getJson(uri + '/modules/', null);
        }));
    };
    RestClient.prototype.getTool = function (toolId) {
        var _this = this;
        return this.getToolboxUri().pipe(operators_1.mergeMap(function (uri) { return _this.getJson(uri + '/tools/' + toolId, null); }), operators_1.map(function (toolBoxTool) { return toolBoxTool.sadlDescription; }));
    };
    RestClient.prototype.downloadFile = function (sessionId, datasetId, file) {
        var _this = this;
        return this.getFileBrokerUri().pipe(operators_1.mergeMap(function (fileBrokerUri) { return _this.getToFile(fileBrokerUri + '/sessions/' + sessionId + '/datasets/' + datasetId, file); }));
    };
    RestClient.prototype.getToFile = function (uri, file) {
        var _this = this;
        var subject = new rxjs_1.Subject();
        this.getFileBrokerUri()
            .subscribe(function (fileBrokerUri) {
            request.get(uri)
                .on('response', function (resp) { return _this.checkForError(resp); })
                .on('end', function () {
                subject.next();
                subject.complete();
            })
                .auth('token', _this.token)
                .pipe(_this.getWriteStream(file));
        });
        return subject;
    };
    RestClient.prototype.getWriteStream = function (file) {
        if (file === '-') {
            return process.stdout;
        }
        else {
            return fs.createWriteStream(file);
        }
    };
    RestClient.prototype.getReadStream = function (file) {
        if (file === '-') {
            return process.stdin;
        }
        else {
            return fs.createReadStream(file);
        }
    };
    RestClient.prototype.uploadFile = function (sessionId, datasetId, file) {
        var _this = this;
        var subject = new rxjs_1.Subject();
        this.getFileBrokerUri()
            .subscribe(function (fileBrokerUri) {
            var req = request.put(fileBrokerUri + '/sessions/' + sessionId + '/datasets/' + datasetId)
                .auth('token', _this.token)
                .on('response', function (resp) { return _this.checkForError(resp); })
                .on('end', function () {
                subject.next(datasetId);
                subject.complete();
            });
            _this.getReadStream(file)
                .pipe(req);
        });
        return subject;
    };
    RestClient.prototype.getRules = function (sessionId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.getJson(sessionDbUri + '/sessions/' + sessionId + '/rules', _this.token); }));
    };
    RestClient.prototype.postRule = function (sessionId, username, readWrite) {
        var _this = this;
        var rule = { session: { sessionId: sessionId }, username: username, readWrite: readWrite };
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.postJson(sessionDbUri + '/sessions/' + sessionId + '/rules', _this.token, rule); }));
    };
    RestClient.prototype.deleteRule = function (sessionId, ruleId) {
        var _this = this;
        return this.getSessionDbUri().pipe(operators_1.mergeMap(function (sessionDbUri) { return _this.deleteWithToken(sessionDbUri + '/sessions/' + sessionId + '/rules/' + ruleId, _this.token); }));
    };
    RestClient.prototype.checkForError = function (response) {
        if (response.statusCode >= 300) {
            throw new Error(response.stausCode + ' - ' + response.statusMessage);
        }
    };
    RestClient.prototype.getFile = function (sessionId, datasetId, maxLength) {
        var _this = this;
        // Range request 0-0 would produce 416 - Range Not Satifiable
        if (maxLength === 0) {
            return rxjs_1.of("");
        }
        return this.getFileBrokerUri().pipe(operators_1.mergeMap(function (fileBrokerUri) {
            return _this.getWithToken(fileBrokerUri + '/sessions/' + sessionId + '/datasets/' + datasetId, _this.token, { Range: 'bytes=0-' + maxLength });
        }));
    };
    RestClient.prototype.getAuthUri = function () {
        return this.getServiceUri('auth');
    };
    RestClient.prototype.getFileBrokerUri = function () {
        return this.getServiceUri('file-broker');
    };
    RestClient.prototype.getSessionDbUri = function () {
        return this.getServiceUri('session-db');
    };
    RestClient.prototype.getSessionDbEventsUri = function () {
        return this.getServiceUri('session-db-events');
    };
    RestClient.prototype.getToolboxUri = function () {
        return this.getServiceUri('toolbox');
    };
    RestClient.prototype.getSessionWorkerUri = function () {
        return this.getServiceUri('session-worker');
    };
    RestClient.prototype.getServices = function () {
        return this.getJson(this.serviceLocatorUri + '/services', null);
    };
    RestClient.prototype.getServiceUri = function (serviceName) {
        return this.getServices().pipe(operators_1.map(function (services) {
            var service = services.filter(function (service) { return service.role === serviceName; })[0];
            if (!service) {
                rxjs_1.throwError(new errors.InternalServerError('service not found' + serviceName));
            }
            // the typeService doesn't have up-to-date token for itself, so we don't have access
            // to the internal URL
            //return this.isClient ? service.publicUri : service.uri;
            return service.publicUri;
        }));
    };
    RestClient.prototype.getServiceLocator = function (webServer) {
        var _this = this;
        return rx_http_request_1.RxHR.get(webServer + '/assets/conf/chipster.yaml').pipe(operators_1.map(function (resp) {
            var body = _this.handleResponse(resp);
            var conf = YAML.parse(body);
            return conf['service-locator'];
        }));
    };
    RestClient.prototype.getJson = function (uri, token) {
        return this.getWithToken(uri, token).pipe(operators_1.map(function (data) { return JSON.parse(data); }));
    };
    RestClient.prototype.getWithToken = function (uri, token, headers) {
        if (token) {
            return this.get(uri, this.getBasicAuthHeader('token', token, headers));
        }
        else {
            return this.get(uri, headers);
        }
    };
    RestClient.prototype.getBasicAuthHeader = function (username, password, headers) {
        if (!headers) {
            headers = {};
        }
        headers['Authorization'] = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        return headers;
    };
    RestClient.prototype.get = function (uri, headers) {
        var _this = this;
        var options = { headers: headers };
        logger.debug('get()', uri + ' ' + JSON.stringify(options.headers));
        return rx_http_request_1.RxHR.get(uri, options).pipe(operators_1.map(function (data) { return _this.handleResponse(data); }));
    };
    RestClient.prototype.post = function (uri, headers, body) {
        var _this = this;
        var options = { headers: headers, body: body };
        logger.debug('post()', uri + ' ' + JSON.stringify(options.headers));
        return rx_http_request_1.RxHR.post(uri, options).pipe(operators_1.map(function (data) { return _this.handleResponse(data); }));
    };
    RestClient.prototype.put = function (uri, headers, body) {
        var _this = this;
        var options = { headers: headers, body: body };
        logger.debug('put()', uri + ' ' + JSON.stringify(options.headers));
        return rx_http_request_1.RxHR.put(uri, options).pipe(operators_1.map(function (data) { return _this.handleResponse(data); }));
    };
    RestClient.prototype.postJson = function (uri, token, data) {
        var headers = this.getBasicAuthHeader('token', token);
        headers['content-type'] = 'application/json';
        return this.post(uri, headers, JSON.stringify(data));
    };
    RestClient.prototype.putJson = function (uri, token, data) {
        var headers = this.getBasicAuthHeader('token', token);
        headers['content-type'] = 'application/json';
        return this.put(uri, headers, JSON.stringify(data));
    };
    RestClient.prototype.deleteWithToken = function (uri, token) {
        return this.delete(uri, this.getBasicAuthHeader('token', token));
    };
    RestClient.prototype.delete = function (uri, headers) {
        var options = { headers: headers };
        return rx_http_request_1.RxHR.delete(uri, options);
    };
    RestClient.prototype.handleResponse = function (data) {
        if (data.response.statusCode >= 200 && data.response.statusCode <= 299) {
            logger.debug('response', data.body);
            return data.body;
        }
        else {
            if (data.response.statusCode >= 400 && data.response.statusCode <= 499) {
                logger.debug('error', data.response.statusCode + ' ' + data.response.statusMessage + ' ' + data.response.body);
                throw this.responseToError(data.response);
            }
            else {
                logger.error('error', data.response.statusCode + ' ' + data.response.statusMessage + ' ' + data.response.body);
                throw new errors.InternalServerError('request ' + data.response.request.method + ' ' + data.response.request.href + ' failed');
            }
        }
    };
    RestClient.prototype.responseToError = function (response) {
        if (this.isClient) {
            return new Error(response.statusCode + ' - ' + response.statusMessage + ' (' + response.body + ') ' + response.request.href);
        }
        else {
            return new errors.HttpError({
                restCode: response.statusMessage,
                statusCode: response.statusCode,
                message: response.body
            });
        }
    };
    return RestClient;
}());
exports.RestClient = RestClient;
