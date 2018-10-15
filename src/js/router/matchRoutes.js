import { matchPath } from './matchPath';

export const matchRoutes = (pathname, routes) => {
    var matched = null;
    var params = {};
    const len = routes.length;
    for (let i = 0; i < len; ++i) {
        const route = routes[i];
        const { path, exact = false, component } = route;
        const match = matchPath(pathname, { path, exact });

        if (match) {
            matched = component;
            params = match.params;
            break;
        }
    }

    return {
        component: matched,
        params: params
    };
};