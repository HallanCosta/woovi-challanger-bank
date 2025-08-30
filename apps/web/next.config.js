const path = require('path');

module.exports = {
	reactStrictMode: true,
	transpilePackages: ['@woovi-playground/ui'],
	compiler: {
		relay: require('./relay.config'),
	},
	webpack: (config) => {
		config.resolve.alias['@'] = path.join(__dirname, 'src');
		return config;
	},
};
