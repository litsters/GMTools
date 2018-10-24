"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    app.route('/auth/login')
        .post(postLogin);
}
exports.default = default_1;
function postLogin(request, response) {
    response.json({
        "success": "true!!!"
    });
}
//# sourceMappingURL=auth.js.map