import { Application, Request, Response } from 'express';

export default function (app: Application) {
    app.route('/user/character')
        .get(getCharacter)
        .post(postCharacter)
        .put(putCharacter);

    app.route('/user/characters')
        .get(getUserCharacters);
}

function getCharacter(request: Request, response: Response) {
    new Error("not implemented");
}

function postCharacter(request: Request, response: Response) {
    new Error("not implemented");
}

function putCharacter(request: Request, response: Response) {
    new Error("not implemented");
}

function getUserCharacters(request: Request, response: Response) {
    new Error("not implemented");
}

