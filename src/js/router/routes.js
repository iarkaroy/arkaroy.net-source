
import HomePage from '../pages/HomePage';
import ProjectPage from '../pages/project.page';
import ArticlesPage from '../pages/ArticlesPage';
import ArticlePage from '../pages/ArticlePage';

const routes = [
    {
        path: '/',
        exact: true,
        component: HomePage
    },
    {
        path: '/projects/:id',
        component: ProjectPage
    },
    {
        path: '/articles',
        exact: true,
        component: ArticlesPage
    },
    {
        path: '/articles/:slug',
        component: ArticlePage
    }
];
export default routes;