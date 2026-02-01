import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: './dist/main.js',
  platform: 'node',
  target: 'es2022',
  format: 'esm',
  bundle: true,
  minify: true,
  external: [
    'tigerbeetle-node',
    'koa',
    '@koa/cors',
    '@koa/router',
    'koa-bodyparser',
  ],
});

console.log('✅ Build completed!');
