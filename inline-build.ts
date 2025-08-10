#!/usr/bin/env bun

// Script to inline JavaScript files into HTML
import { readdir } from "node:fs/promises";

async function inlineJavaScript() {
  try {
    // Read the HTML file
    const htmlFile = Bun.file("dist/index.html");
    const htmlContent = await htmlFile.text();
    
    // Find all JS files in dist directory
    const files = await readdir("dist");
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    if (jsFiles.length === 0) {
      console.log("No JavaScript files found in dist directory");
      return;
    }
    
    let updatedHtml = htmlContent;
    
    // Process each JavaScript file
    for (const jsFile of jsFiles) {
      const jsFilePath = `dist/${jsFile}`;
      let jsContent = await Bun.file(jsFilePath).text();
      
      // Clean up any references to the original script file in the JS content
      // This handles the specific pattern that Bun embeds in the bundled code
      const scriptTag = `<script type="module" crossorigin src="./${jsFile}"></script>`;
      
      // Replace the script tag references in the JavaScript content
      jsContent = jsContent.replaceAll(scriptTag, '');
      jsContent = jsContent.replaceAll(`"${scriptTag}"`, '""');
      jsContent = jsContent.replaceAll(`"${scriptTag}/"`, '""');
      jsContent = jsContent.replaceAll(`${scriptTag}/`, '/');
      jsContent = jsContent.replaceAll(`${scriptTag}&`, '&');
      
      // Find and replace the script tag that references this JS file in HTML
      // Handle both with and without type/crossorigin attributes
      const scriptTagPatterns = [
        new RegExp(`<script[^>]*src=["']\\.\/${jsFile}["'][^>]*></script>`, 'g'),
        new RegExp(`<script type="module" crossorigin src="\\.\/${jsFile}"></script>`, 'g'),
        new RegExp(`<script src="\\.\/${jsFile}"></script>`, 'g')
      ];
      
      // Replace with inline script tag using all patterns
      for (const pattern of scriptTagPatterns) {
        updatedHtml = updatedHtml.replace(pattern, `<script>${jsContent}</script>`);
      }
      
      console.log(`Inlined ${jsFile} (${(jsContent.length / 1024).toFixed(1)}KB)`);
    }
    
    // Write the updated HTML file
    await Bun.write("dist/index.html", updatedHtml);
    
    console.log("JavaScript files successfully inlined into HTML");
    
  } catch (error) {
    console.error("Error inlining JavaScript:", error);
    process.exit(1);
  }
}

// Run the script
await inlineJavaScript();