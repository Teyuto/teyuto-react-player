export default {
    input: 'src/index.js',
    output: [{
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        strict: false
    }],
    plugins: [],
    external: ['react']
};
