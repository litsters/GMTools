export default function (app) {
    app.route('/auth/login')
        .post(postLogin);
}

function postLogin(request, response) {
    response.json({
        "success": "true!!!"
    })
}