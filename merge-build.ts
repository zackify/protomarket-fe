#!/usr/bin/env bun
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function mergeBuild() {
  const distDir = "dist";
  
  try {
    // Read all files in dist directory
    const files = await readdir(distDir);
    
    // Find HTML and JS files
    const htmlFile = files.find(f => f.endsWith('.html'));
    const jsFile = files.find(f => f.endsWith('.js'));
    
    if (!htmlFile || !jsFile) {
      console.error('Could not find HTML or JS file in dist directory');
      process.exit(1);
    }
    
    // Read the HTML and JS content
    const htmlPath = join(distDir, htmlFile);
    const jsPath = join(distDir, jsFile);
    
    const htmlContent = await readFile(htmlPath, 'utf-8');
    const jsContent = await readFile(jsPath, 'utf-8');
    
    // Replace the script tag with inline script
    const scriptRegex = /<script[^>]*src="[^"]*"[^>]*><\/script>/;
    const escapedJsContent = jsContent.replace(/<\/script>/gi, '<\\/script>');
    const inlinedHtml = htmlContent.replace(scriptRegex, `<script type="module">\n${escapedJsContent}\n</script>`);
    
    // Write the merged HTML file
    const mergedPath = join(distDir, 'index-merged.html');
    await writeFile(mergedPath, inlinedHtml);
    
    console.log(`✅ Merged ${jsFile} into ${htmlFile} → index-merged.html`);
    
  } catch (error) {
    console.error('Error merging build files:', error);
    process.exit(1);
  }
}

mergeBuild();