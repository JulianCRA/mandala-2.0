const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						"presets": [
							"@babel/preset-env", 
							"@babel/preset-react"
						],
					
						"plugins": [
							["@babel/plugin-proposal-class-properties", { "loose": true }],
							["@babel/plugin-syntax-class-properties"]
						]
					}
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
		]
	},

	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		}),
		//new BundleAnalyzerPlugin()
	],

	devtool: "source-map"
};
