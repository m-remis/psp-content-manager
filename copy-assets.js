const fs = require('fs-extra');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');

async function copyAndMinifyAssets() {
    console.log('Copying assets...');
    try {
        const htmlFilePath = 'src/renderer/index.html';
        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        const minifiedHtml = minify(htmlContent, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true
        });
        await fs.outputFile('dist/renderer/index.html', minifiedHtml);

        const cssFilePath = 'src/renderer/styles.css';
        const cssContent = await fs.readFile(cssFilePath, 'utf8');
        const minifiedCss = new CleanCSS().minify(cssContent).styles;
        await fs.outputFile('dist/renderer/styles.css', minifiedCss);

        console.log('Assets copied and minified successfully.');
    } catch (err) {
        console.error('Error copying or minifying assets:', err);
    }
}
copyAndMinifyAssets();
