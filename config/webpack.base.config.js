const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const incstr = require('incstr');

const createUniqueIdGenerator = () => {
    const index = {};

    const generateNextId = incstr.idGenerator({
        // Removed "d" letter to avoid accidental "ad" construct.
        // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
        alphabet: 'abcefghijklmnopqrstuvwxyz'
    });

    return (name) => {
        if (index[name]) {
            return index[name];
        }

        let nextId;

        do {
            // Class name cannot start with a number.
            nextId = generateNextId();
        } while (/^[0-9]/.test(nextId));

        index[name] = generateNextId();

        return index[name];
    };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
    const componentName = resourcePath.split('/').slice(-2, -1);
    return uniqueIdGenerator(localName);
    // return uniqueIdGenerator(componentName) + '_' + uniqueIdGenerator(localName);
};

/*
const generateScopedName = (localName, resourcePath) => {
    const componentName = resourcePath.split('/').slice(-2, -1);
    return componentName + '_' + localName;
};
*/

module.exports = {
    output: {
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: false,
                                // localIdentName: '[hash:base64:5]',
                                getLocalIdent: (context, localIdentName, localName) => {
                                    return generateScopedName(localName, context.resourcePath);
                                },
                            },
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: false,
                            }
                        }
                    ],
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/'
                    }
                }
            },
            {
                test: /\.(ttf|woff2?)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'fonts/'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new ExtractTextPlugin('style.css'),
        new CopyWebpackPlugin([
            { from: 'data/images', to: 'images' }
        ]),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production',
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
              quality: '95-100'
            }
        })
    ]
}