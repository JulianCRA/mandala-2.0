const merge = require('webpack-merge')
const common = require('./webpack.common.js')

const WebpackCdnPlugin = require('webpack-cdn-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
	mode : 'production',

	output : {
		publicPath: './'
	},

	externals : {
		'p5' : 'p5',
		'jQuery' : 'jquery'
	},

	plugins : [
		new WebpackCdnPlugin({
			modules : [
				{
					name: 'p5',
					var: 'p5',
				},
				{
					name: 'jquery',
					var: 'jQuery',
				}
			],
			prod: true
		}),
		new BundleAnalyzerPlugin()
	],

	devtool : "hidden-source-map"
});