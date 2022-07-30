module.exports = {
	mode: 'development',
	entry: {
		FullFlowLoad: './tests/simulations/FullFlowLoad.test.js',
		FullFlowStress: './tests/simulations/FullFlowStress.test.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].test.js',
		libraryTarget: 'commonjs',
	},
	module: {
		rules: [{ test: /\.js$/, use: 'babel-loader' }],
	},
	stats: {
		colors: true,
		warnings: false,
	},
	target: ['node', 'es2019'],
	externals: /k6(\/.*)?/,
	devtool: 'source-map',
}
