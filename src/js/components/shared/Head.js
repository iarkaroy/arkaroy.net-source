import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class Head extends Component {

    static defaultProps = {
        title: '',
        description: 'A self-taught full stack web developer having 8+ years of experience.'
    };

    render() {
        var { title, description } = this.props;
        if (title) {
            title += ' | ';
        }
        title += 'Arka Roy - Web Developer';
        var image = 'https://www.arkaroy.net/social-share.jpg';
        return (
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content="https://www.arkaroy.net" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:creator" content="@iarkaroy" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:image:src" content={image} />
                {/* Google+ */}
                <meta itemprop="name" content={title} />
                <meta itemprop="description" content={description} />
                <meta itemprop="image" content={image} />
            </Helmet>
        );
    }

}

export default Head;