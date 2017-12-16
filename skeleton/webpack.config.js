const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css"
});

let sassFiles = readDirRecursive("./src/common/assets", {extension: ".scss"});

module.exports = [
    buildConfiguration("chrome")
];

function buildConfiguration(browser) {

    let entry = {
        "background": "./src/chrome/main/background.js",
        "contentScript": "./src/chrome/main/contentScript.js"
    };

    return {
        entry: Object.assign(entry, sassFiles),
        output: {
            path: path.resolve(__dirname, "dist/" + browser + ""),
            filename: "js/[name].js"
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"]
                    }
                },
                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader"
                        }],
                        // use style-loader in development
                        fallback: "style-loader"
                    })
                }
            ]
        },
        resolve: {
            modules: [
                "node_modules",
                path.resolve(__dirname, "src/" + browser + "/js"),
                path.resolve(__dirname, "src/common/js")
            ],
            extensions: [".js", ".json", ".css"],
        },
        plugins: [
            extractSass,
            new CopyWebpackPlugin([
                {from: "src/assets/img", to: "assets"},
                {from: "src/chrome/manifest.json"},
            ])
        ]
    }
}

function readDirRecursive(dirPath, options) {

    options = options || {};
    let extension = options.extension || null;

    let outputFiles = [];


    let stats = fs.statSync(dirPath);

    if (stats.isDirectory()) {
        let files = fs.readdirSync(dirPath);

        files.forEach(function(file) {
            outputFiles = outputFiles.concat(readDirRecursive(dirPath + "/" + file, options));
        });
    } else {
        if (extension === null || dirPath.match(new RegExp(extension.replace(".", "\\.") + "$"))) {
            outputFiles.push(dirPath);
        }
    }

    return outputFiles;
}
