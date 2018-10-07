import { Application, Request, Response } from 'express';

export default function (app: Application) {
    app.route('/auth/login')
        .post(postLogin);
}

function postLogin(request: Request, response: Response) {
    response.json({
        "success": "true!!!"
    })
}