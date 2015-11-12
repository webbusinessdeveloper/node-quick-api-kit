var app = require("express")();
var bodyParser = require("body-parser");
var httpResponses = require("constants/httpResponses");
var mongoose = require("mongoose");
var dbUri = require("private/databaseSecrets").databaseUri;
var httpResponder = require("shared/httpResponder");

mongoose.connect(dbUri);


exports.localBaseUrl = "http://localhost:";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


var userEndpoint = exports.usersEndpoint = "/users";
var userAuthRoutes = require("../resources/users/authRoutes");
//user authRoutes
app.use(userEndpoint, userAuthRoutes);


//Routes for testing
exports.testRoute = "/test-route";
exports.authNeededTestRoute = "/auth-needed-test-route";

app.get(this.testRoute, function(req, res) {
    return res.json(
        httpResponder.respondToOKRequest(httpResponses.successfulTestRouteGETResponseMessage)
    );
});
app.post(this.testRoute, function(req, res) {
    return res.json(
        httpResponder.respondToCREATEDRequest(httpResponses.successfulTestRoutePOSTResponseMessage)
    );
});
app.put(this.testRoute, function(req, res) {
    return res.json(
        httpResponder.respondToOKRequest(httpResponses.successfulTestRoutePUTResponseMessage)
    );
});
app.delete(this.testRoute, function(req, res) {
    return res.json(
        httpResponder.respondToOKRequest(httpResponses.successfulTestRouteDELETEResponseMessage)
    );
});

/*TOKEN VERIFICATION MIDDLEWARE*/
var verifyTokenMiddleware = require("../middleware/verifyToken");
app.use("/", verifyTokenMiddleware);
/*Define Routes that need authentication after this line*/

/*AUTH needed test route*/
app.post(this.authNeededTestRoute, function(req,res) {
    return res.json(
        httpResponder.respondToOKRequest(httpResponses.successfulTestRouteAuthNeededResponseMessage)
   );
});


exports.serverListeningMessage = "Server is listening on port: ";
exports.serverClosingMessage = "Server is closing on port: ";

exports.start = function(port, callback) {
    var message = this.serverListeningMessage + port;
    server = app.listen(port, callback);
    console.log(message);
    return message;
};
exports.stop = function(port, callback) {
    var message = this.serverClosingMessage + port;
    server.close(callback);
    console.log(message);
    return message;
};


