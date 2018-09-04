import React, { Component } from 'react';
import * as store from '../store';
import { Link } from '../router';

class ArticlesPage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            articles: []
        };
    }

    componentDidMount() {
        this.setState({
            articles: store.articles()
        });
    }

    render() {
        const { articles } = this.state;
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br /><br />
                <h1>Articles</h1>
                {articles.map((article, index) => {
                    return <h2 key={index}><Link to={`/articles/${article.data.slug}`}>{article.data.title}</Link></h2>
                })}
            </div>
        );
    }

}

export default ArticlesPage;