import React, { Component } from 'react';
import * as store from '../store';
import { Link } from '../router';

class ArticlePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            article: null
        };
    }

    componentDidMount() {
        const slug = this.props.params.slug
        this.setState({
            article: store.article(slug)
        });
    }

    render() {
        const { article } = this.state;
        if (!article) return null;
        const { data } = article;
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br /><br />
                <h1>{data.title}</h1>
                <div dangerouslySetInnerHTML={{__html: article.html}}></div>
            </div>
        );
    }

}

export default ArticlePage;