export default function (app) {
    app.route('/auth/login')
        .get(getLogin)
        .post(postLogin);
}

function getLogin(request, response) {
    
}

function postLogin(request, response) {
    response.json({
        "success": "true!!!"
    })
}