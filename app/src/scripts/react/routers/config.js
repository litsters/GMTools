const gameRoute = "/game";


export const MainConfig = {
    routes: {
        login:  { path: "/login",   component: "LoginPage" },
        game:   { path: "/game",    component: "GamePage" },
        default:{ path: "/",        component: "NotFoundPage" }
    }
};

export const GameConfig = {
    routes: {
        dice:   { path: `${gameRoute}/dice`,    component: "DicePage" }
    }
}

