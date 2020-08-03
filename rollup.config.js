import serve from 'rollup-plugin-serve';
import htmlPlugin from 'rollup-plugin-html-input';

export default {
  input: 'index.html',
  output: {
    dir: 'bundle/',
    format: 'iife',
  },
  plugins: [htmlPlugin(), serve('bundle')],
};
