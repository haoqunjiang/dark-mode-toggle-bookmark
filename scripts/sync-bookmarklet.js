#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const JS_PREFIX = 'javascript:';
const jsPath = path.resolve(process.cwd(), process.argv[2] || 'dark_mode_toggle.js');
const htmlPath = path.resolve(process.cwd(), process.argv[3] || 'dark_mode_toggle.html');

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function loadBookmarkletSource(filePath) {
  if (!fs.existsSync(filePath)) fail(`JS file not found: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith(JS_PREFIX)) {
    fail(`Expected ${path.basename(filePath)} to start with "${JS_PREFIX}"`);
  }
  return raw.slice(JS_PREFIX.length);
}

function validateJavaScript(jsSource, context) {
  try {
    // Syntax validation only.
    new Function(jsSource);
  } catch (error) {
    fail(`${context} is invalid JavaScript: ${error.message}`);
  }
}

function updateHtmlHref(htmlSource, bookmarkletHref) {
  let replaced = false;
  const updated = htmlSource.replace(/(HREF=")javascript:[^"]*(")/i, (_match, p1, p2) => {
    replaced = true;
    return `${p1}${bookmarkletHref}${p2}`;
  });

  if (!replaced) {
    fail('Could not find a HREF="javascript:..." entry in the HTML file');
  }

  return updated;
}

function validateGeneratedHtml(htmlSource) {
  const hrefMatch = htmlSource.match(/HREF="([^"]+)"/i);
  if (!hrefMatch) fail('No HREF attribute found after update');

  const href = hrefMatch[1];
  if (!href.startsWith(JS_PREFIX)) fail('Updated HREF is not a javascript bookmarklet');

  const decodedSource = decodeURIComponent(href.slice(JS_PREFIX.length));
  validateJavaScript(decodedSource, 'Generated bookmarklet');
}

const jsSource = loadBookmarkletSource(jsPath);
validateJavaScript(jsSource, path.basename(jsPath));

const bookmarkletHref = `${JS_PREFIX}${encodeURIComponent(jsSource)}`;

if (!fs.existsSync(htmlPath)) fail(`HTML file not found: ${htmlPath}`);
const htmlSource = fs.readFileSync(htmlPath, 'utf8');
const updatedHtml = updateHtmlHref(htmlSource, bookmarkletHref);
validateGeneratedHtml(updatedHtml);

fs.writeFileSync(htmlPath, updatedHtml);
console.log(`Updated ${path.basename(htmlPath)} from ${path.basename(jsPath)}`);
