if (process.env.VITEST === 'true') {
  if (!globalThis.jest) {
    globalThis.jest = {
      mock: vi.mock,
      setTimeout: (timeout) => {
        vi.setConfig({ testTimeout: timeout });
      },
      fn: vi.fn,
      requireActual: vi.importActual,
    };
  }
}

const { Command } = jest.requireActual('ioredis');
const Redis = jest.requireActual('ioredis-mock');

// second mock for our code
function RedisMock(...args) {
  return new Redis(args);
}

module.exports = {
  __esModule: true,
  Command,
  default: RedisMock,
};