/*
 Server setup to test routing against xdsdocumentconsumer

 node mhd.js

 */

var https = require("https");
var vows = require("vows");
var check = require("validator").check;
var constants = require("./config/constants.js");
var url = require("./config/url.js");

function get(url, cb) {
    var req = https.get(url, function (res) {
            res.setEncoding("UTF-8");
            var data = "";
            res.on("data", function (chunk) {
                data += chunk.toString();
            });
            res.on("end", function () {
                cb(null, res, data);
            });
        }
    )
    req.on("error", function (err) {
        cb(err, null, null);
    });
    req.end();
}

vows.describe("Server behaviour").addBatch({
    "when browsing root url":{
        topic:function () {
            get(constants.root, this.callback);
        },
        'the status code is 403':function (err, res, data) {
            check(res.statusCode).is(403);
        },
        "the reason phrase is 'Request not supported'":function (err, res, data) {
            check(data).is("Request not supported");
        }
    },
    "when browsing unknown url":{
        topic:function () {
            get(url.unknown, this.callback);
        },
        'the status code is 403':function (err, res, data) {
            check(res.statusCode).is(403);
        },
        "the reason phrase is 'Request not supported'":function (err, res, data) {
            check(data).is("Request not supported");
        }
    }
}).addBatch({
        "when findDocumentDossiers url is well-formed":{
            topic:function () {
                get(url.findDocumentDossiersReq, this.callback);
            },
            'the status code is 200':function (err, res, data) {
                check(res.statusCode).is(200);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                var result = JSON.parse(data);
            }
        },
        "when findDocumentDossiers url has missing patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdMissing, this.callback);
            },
            'the status code is 400':function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when findDocumentDossiers url has empty patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdEmpty, this.callback);
            },
            'the status code is 400':function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when findDocumentDossiers url has malformed patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdMalformed, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        }/*,
         "when findDocumentDossiers url has patientId not known to responder" : {
         topic: function() {
         get(url.findDocumentDossiersReq_patientIdNotKnown, this.callback);
         },
         "the status code is 404": function(err, res, data) {
         check(res.statusCode).is(404);
         },
         "the reason phrase is 'No Document Entries found'": function(err, res, data) {
         check(data).is("No Document Entries found");
         }
         }*/,
        "when findDocumentDossiers url has patientId for patient with no documents":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdNoDocuments, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'No Document Entries found'":function (err, res, data) {
                check(data).is("No Document Entries found");
            }
        }
    }).addBatch({
        "when GetDocumentDossier url is well-formed":{
            topic:function () {
                get(url.getDocumentDossierReq, this.callback);
            },
            "the status code is 200":function (err, res, data) {
                check(res.statusCode).is(200);
            },
            "the body is DocumentDossier json":function (err, res, data) {
                var body = JSON.parse(data);
            }
        },
        "when GetDocumentDossier url has missing uuid":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidMissing, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has malformed uuid":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidMalformed, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has uuid not known to responder":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidNotKnown, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'Document Entry UUID not found'":function (err, res, data) {
                check(data).is("Document Entry UUID not found");
            }
        }/*,
         "when GetDocumentDossier url has uuid for deprecated document" : {
         topic: function() {
         get(url.getDocumentDossierReq_uuidDeprecated, this.callback);
         },
         "the status code is 410": function(err, res, data) {
         check(res.statusCode).is(410);
         },
         "the reason phrase is 'Document Entry UUID deprecated'": function(err, res, data) {
         check(data).is("Document Entry UUID deprecated");
         }
         }*/,
        "when GetDocumentDossier url has missing patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdMissing, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has empty patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdEmpty, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has malformed patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdMalformed, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        }/*,
         "when GetDocumentDossier url has patientId not known to responder" : {
         topic: function() {
         get(url.getDocumentDossierReq_patientIdNotKnown, this.callback);
         },
         "the status code is 404": function(err, res, data) {
         check(res.statusCode).is(404);
         },
         "the reason phrase is 'Document Entry UUID not found'": function(err, res, data) {
         check(data).is("Document Entry UUID not found");
         }
         }*/
    }).addBatch({
        "when GetDocument url is well-formed":{
            topic:function () {
                get(url.getDocumentReq, this.callback);
            },
            "the status code is 200":function (err, res, data) {
                check(res.statusCode).is(200);
            }
        },
        "when GetDocument url has missing uuid":{
            topic:function () {
                get(url.getDocumentReq_uuidMissing, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has malformed uuid":{
            topic:function () {
                get(url.getDocumentReq_uuidMalformed, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has missing patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdMissing, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has empty patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdEmpty, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has malformed patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdMalformed, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has uuid not known to responder":{
            topic:function () {
                get(url.getDocumentReq_uuidNotKnown, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'Document Entry UUID not found'":function (err, res, data) {
                check(data).is("Document Entry UUID not found");
            }
        }
    }).run();