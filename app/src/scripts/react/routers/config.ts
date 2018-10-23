/*
    This file contains the routing configuration for the app. 
    Routes are declared with a specified component to render when the path is matched. 
    
    COMPONENT:
        The component property defines the content to be rendered if the given route is matched. In order for the
        component to render, it must be imported in the MainRouter class, and then added to the const variable 'components'.
        The name in this configuration must match the name or alias of the imported component exactly.

    CHILDREN:
        Children can be specified as well, either as a separate route or under the 'children' property of a 
        top-level route. The purpose of declaring children as a property would primarily be for rendering 
        menus based on this configuration, as opposed to hard-coding menus.

        If the children are being used in a menu it is important to include properties such as 'text', 'icon', and other
        properties that are necessary for the specific menu.

    LAYOUTS:
        Layouts are wrappers around the content of a page in order to keep a consistent look between views.
        To use a specific layout for a page, specify the layout as a property of a top-level route. The layout
        must then be imported in the MainRouter class, and added to the const variable 'layouts'. Children routes
        will inherit the layout from their parent, if specified.

    

*/

const gameRoute = "/game";

interface RouteDefs {
    routes: {[key: string]: RouteDef}
}

interface RouteDef {
    path: string,
    dynamic?: string,
    component: string,

    children?: {[key: string]: RouteDef}

    layout?: string,
    exact?: boolean,
    showInMenu?: boolean,
    icon?: string
    text?: string
    visibleTo?: "gm" | "player"
}

export const MainRouterConfig: RouteDefs = {
    routes: {
        login:  { path: "/login",   component: "LoginPage" },
        game:   { path: gameRoute,  component: "GamePage",  layout: "GameLayout",   exact: true,
            children: {
                lookup: { path: `${gameRoute}/lookup`,  dynamic: `${gameRoute}/lookup/:category?/:id?`, component: "LookupPage",showInMenu: true,   icon: null, text: "lookup", visibleTo: "gm", exact: false },
                dice:   { path: `${gameRoute}/dice`,    component: "DicePage",  showInMenu: true,   icon: null, text: "dice",   visibleTo: "gm" },
                initiative: { path: `${gameRoute}/initiative`,component: "InitiativePage",showInMenu: true,icon: null, text: "initiative",   visibleTo: "gm" },                
                generator:  { path: `${gameRoute}/generator`,component: "GeneratorPage",showInMenu: true,   icon: null, text: "generator",   visibleTo: "gm" }
            }},
        default:{ path: "/",        component: "Dashboard" }
    }
};

