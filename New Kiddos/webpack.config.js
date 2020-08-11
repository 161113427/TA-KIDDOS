const path = require("path");
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
    entry: { home: "./public/js/home.js", parent: "./public/js/parent.js", login: "./public/js/login.js", register: "./public/js/register.js", verificationEmail: "./public/js/verificationEmail.js", addChildren: './public/js/addChildren.js', verificationChildren: "./public/js/verificationChildren.js", accountSettings: "./public/js/accountSettings.js" },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name].js"
    },

    mode: "production",
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: '../fonts/'
                    }
                }]
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: '../images/'
                    }
                }]
            }
        ],
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: "./src/index.html",
    //         filename: "index.html"
    //     })
    // ]
    plugins: [
        new MinifyPlugin()
    ]
}