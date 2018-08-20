
import HomePage from '../pages/home.page';
import ProjectPage from '../pages/project.page';

const routes = [
    {
        path: '/',
        exact: true,
        component: HomePage
    },
    {
        path: '/projects/:id',
        component: ProjectPage
    }
];
export default routes;