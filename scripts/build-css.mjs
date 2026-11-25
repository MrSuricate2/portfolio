// Minifie assets/css/style.css -> assets/css/style.min.css
// puis injecte la même feuille inline dans le <head> de index.html
// (entre les marqueurs inline-css:start / inline-css:end) pour supprimer
// la requête CSS bloquante au rendu.
import { transform } from 'lightningcss';
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('assets/css/style.css');
const { code } = transform({ filename: 'style.css', code: src, minify: true });
const min = code.toString();
writeFileSync('assets/css/style.min.css', min);

// index.html est à la racine : les chemins relatifs aux polices changent.
const inline = min.replaceAll('../font/', './assets/font/');
const html = readFileSync('index.html', 'utf8');
const re = /<!-- inline-css:start -->[\s\S]*?<!-- inline-css:end -->/;
if (!re.test(html)) throw new Error('Marqueurs inline-css introuvables dans index.html');
writeFileSync(
  'index.html',
  html.replace(re, () => `<!-- inline-css:start -->\n  <style>${inline}</style>\n  <!-- inline-css:end -->`)
);
console.log(`style.min.css: ${min.length} octets`);
