import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: './dist/main.cjs',
  platform: 'node',
  target: 'es2022',
  format: 'cjs',
  bundle: true,
  minify: true,
  external: [
    'ws',
    'koa',
    '@koa/cors',
    '@koa/router',
    'koa-bodyparser',
  ],
});

console.log('✅ Build completed!');
