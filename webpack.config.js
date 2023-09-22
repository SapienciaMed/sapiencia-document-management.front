/* eslint-disable prettier/prettier */
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const Dotenv = require("dotenv-webpack");

module.exports = (webpackConfigEnv, argv) => {
	const defaultConfig = singleSpaDefaults({
		orgName: "sapiencia",
		projectName: "document-management",
		webpackConfigEnv,
		argv,
	});

	return merge(defaultConfig, {
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
								modules: true,
							},
						},
						"sass-loader",
					],
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2)$/,
					use: {
						loader: "url-loader",
					},
				},
				{
					test: /\.png$/,
					exclude: /public/,
					use: "file-loader",
				},
			],
		},
		plugins: [new Dotenv()],
	});
};
