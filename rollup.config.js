export default {
    input: 'src/TeyutoPlayer.js',
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
