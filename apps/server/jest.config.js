const pack = require('./package.json');

const jestTransformer = () => {
  if (process.env.JEST_TRANSFORMER === 'babel-jest') {
    // eslint-disable-next-line
    console.log('babel-jest');

    return {
      '^.+\\.(js|ts|tsx)?$': 'babel-jest',
    }
  }

  // eslint-disable-next-line
  console.log('babel-barrel');

  return {
    '^.+\\.(js|ts|tsx)?$': require.resolve('./babelBarrel'),
  };
};

module.exports = {
  displayName: pack.name,
  testPathIgnorePatterns: ['/node_modules/', './dist', '/src/__tests__/setup/'],
  resetModules: false,
  transform: {
    ...jestTransformer(),
  },
  // setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/index.ts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'json'],
  testTimeout: 120000, // 120 segundos para cada teste
  detectOpenHandles: true,
  forceExit: true, // Força saída após os testes
  // Configurações específicas para MongoMemoryServer
  // globals: {
  //   'ts-jest': {
  //     isolatedModules: true,
  //   },
  // },
};
