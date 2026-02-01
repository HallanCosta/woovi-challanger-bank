const path = require('path');

module.exports = {
	reactStrictMode: true,
	transpilePackages: ['@challanger-bank/ui'],
	compiler: {
		relay: require('./relay.config'),
	},
	// Turbopack está habilitado por padrão no Next.js 16+
	// Adicione turbopack vazio para silenciar o aviso
	turbopack: {},
	webpack: (config) => {
		config.resolve.alias['@'] = path.join(__dirname, 'src');
		return config;
	},
};
