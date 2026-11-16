import fs from "fs";
import path from "path";
import { SITE_ORIGIN, canonicalUrl, decodeSeoPath } from "./seo.mjs";

const ROOT_PAGES = new Set([
  "index.html",
  "hei.html",
  "kai.html",
  "song.html",
  "art.html",
  "handwriting.html",
  "english.html",
  "open-source.html",
]);

function decodeAttr(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tagByAttr(html, tagName, attr, value) {
  const re = new RegExp(`<${tagName}\\b[^>]*\\b${attr}=["']${value}["'][^>]*>`, "i");
  return html.match(re)?.[0] || "";
}

function attrOf(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match ? decodeAttr(match[1]) : "";
}

function metaContent(html, name) {
  return attrOf(tagByAttr(html, "meta", "name", name), "content");
}

function metaProperty(html, name) {
  return attrOf(tagByAttr(html, "meta", "property", name), "content");
}

function linkHref(html, rel) {
  return attrOf(tagByAttr(html, "link", "rel", rel), "href");
}

function textLength(value) {
  return [...value].length;
}

function htmlFiles(docsRoot) {
  const files = [];
  for (const name of fs.readdirSync(docsRoot)) {
    if (name.endsWith(".html")) files.push(path.join(docsRoot, name));
  }
  const detailsDir = path.join(docsRoot, "details");
  if (fs.existsSync(detailsDir)) {
    for (const name of fs.readdirSync(detailsDir)) {
      if (name.endsWith(".html")) files.push(path.join(detailsDir, name));
    }
  }
  return files;
}

function expectedUrl(docsRoot, file) {
  const rel = path.relative(docsRoot, file).split(path.sep).join("/");
  return canonicalUrl(rel);
}

function checkFile(docsRoot, file, titles, descriptions) {
  const errors = [];
  const rel = path.relative(docsRoot, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const fail = (message) => errors.push(`${rel}: ${message}`);
  const isPreview = rel === "preview.html" || rel === "preview.en.html";
  const isDetail = rel.startsWith("details/");
  const fontName = isDetail ? decodeSeoPath(path.basename(rel, ".html")) : "";

  const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] || "";
  if (rel === "preview.en.html") {
    if (lang !== "en") fail(`lang should be en, got ${lang || "empty"}`);
  } else if (lang !== "zh-CN") {
    fail(`lang should be zh-CN, got ${lang || "empty"}`);
  }

  const robots = metaContent(html, "robots").replace(/\s/g, "");
  if (isPreview) {
    if (!/noindex/i.test(robots)) fail("preview page should be noindex");
  } else if (!/^index,follow$/i.test(robots)) {
    fail(`robots should be index,follow, got ${robots || "empty"}`);
  }

  const canonical = linkHref(html, "canonical");
  const expected = expectedUrl(docsRoot, file);
  if (canonical !== expected) fail(`canonical ${canonical || "missing"} != ${expected}`);

  const ogUrl = metaProperty(html, "og:url");
  if (ogUrl !== expected) fail(`og:url ${ogUrl || "missing"} != canonical`);

  if (!metaProperty(html, "og:image").startsWith(SITE_ORIGIN)) fail("og:image is not absolute");
  if (!metaProperty(html, "og:image:alt")) fail("missing og:image:alt");
  if (!metaProperty(html, "og:locale")) fail("missing og:locale");
  if (rel === "preview.en.html") {
    if (metaProperty(html, "og:locale") !== "en_US") fail("og:locale should be en_US");
  } else if (metaProperty(html, "og:locale") !== "zh_CN") {
    fail("og:locale should be zh_CN");
  }
  if (!linkHref(html, "icon")) fail("missing favicon");

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
  const description = metaContent(html, "description").replace(/\s+/g, " ").trim();
  if (!title) fail("missing title");
  if (!description) fail("missing description");
  if (description && (textLength(description) < 20 || textLength(description) > 180)) {
    fail(`description length ${textLength(description)} is outside 20-180`);
  }
  if (description.includes("收录大量可商用的中文与英文字体")) {
    fail("description is still the generic boilerplate");
  }

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) fail(`expected 1 h1, found ${h1s.length}`);
  const h1Text = h1s.map((match) => match[1].replace(/<[^>]+>/g, "")).join("").replace(/\s+/g, " ").trim();
  if (!h1Text) fail("h1 is empty");
  if (isDetail && !h1Text.includes(fontName)) fail("h1 does not include the font name");
  if (isDetail && !description.includes(fontName)) fail("description does not include the font name");
  if (isDetail && !html.includes('class="breadcrumb"')) fail("missing visible breadcrumb");

  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    const alt = attrOf(img[0], "alt");
    if (!alt) fail(`img missing alt: ${img[0].slice(0, 120)}`);
  }

  const jsonBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (jsonBlocks.length !== 1) fail(`expected 1 JSON-LD block, found ${jsonBlocks.length}`);
  let graph = [];
  try {
    const data = JSON.parse(jsonBlocks[0]?.[1] || "");
    graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
  } catch (error) {
    fail(`JSON-LD parse failed: ${error.message}`);
  }
  const website = graph.find((node) => node["@type"] === "WebSite");
  const webpage = graph.find((node) => node["@type"] === "WebPage");
  if (!website || website.url !== SITE_ORIGIN) fail("JSON-LD WebSite url is not the absolute site origin");
  if (!webpage || webpage.url !== expected) fail("JSON-LD WebPage url does not match canonical");
  if (String(website?.url || "").startsWith("..") || website?.url === "") fail("JSON-LD url is relative");
  if (isDetail) {
    const work = graph.find((node) => node["@type"] === "CreativeWork");
    if (!work || work.url !== expected) fail("detail page missing CreativeWork JSON-LD");
    if (!graph.some((node) => node["@type"] === "BreadcrumbList")) fail("detail page missing BreadcrumbList");
  }

  if (!isPreview && title) {
    titles.set(title, [...(titles.get(title) || []), rel]);
  }
  if (!isPreview && description) {
    descriptions.set(description, [...(descriptions.get(description) || []), rel]);
  }
  return errors;
}

function checkSitemap(docsRoot, indexable) {
  const errors = [];
  const txtPath = path.join(docsRoot, "sitemap.txt");
  const xmlPath = path.join(docsRoot, "sitemap.xml");
  const robotsPath = path.join(docsRoot, "robots.txt");
  if (!fs.existsSync(txtPath)) errors.push("sitemap.txt missing");
  if (!fs.existsSync(xmlPath)) errors.push("sitemap.xml missing");
  if (!fs.existsSync(robotsPath)) errors.push("robots.txt missing");
  if (errors.length) return errors;

  const txtUrls = fs
    .readFileSync(txtPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const xmlUrls = [...fs.readFileSync(xmlPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    decodeAttr(match[1]),
  );
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(`${SITE_ORIGIN}sitemap.xml`)) errors.push("robots.txt missing sitemap URL");

  const expected = [...indexable].map((file) => expectedUrl(docsRoot, file)).sort();
  const same = (left, right) => left.length === right.length && left.every((url, index) => url === right[index]);
  const txtSorted = [...txtUrls].sort();
  const xmlSorted = [...xmlUrls].sort();
  if (!same(txtSorted, expected)) {
    errors.push(`sitemap.txt has ${txtUrls.length} URLs, expected ${expected.length} indexable pages`);
  }
  if (!same(xmlSorted, expected)) {
    errors.push(`sitemap.xml has ${xmlUrls.length} URLs, expected ${expected.length} indexable pages`);
  }
  if (txtUrls.some((url) => /preview(?:\.en)?\.html/.test(url))) {
    errors.push("sitemap.txt still lists preview pages");
  }
  if (txtUrls.some((url) => url.includes("?"))) errors.push("sitemap.txt still lists query URLs");
  return errors;
}

export function checkSeo(docsRoot = path.resolve("docs")) {
  const errors = [];
  const titles = new Map();
  const descriptions = new Map();
  const files = htmlFiles(docsRoot);
  const indexable = [];
  if (!files.some((file) => path.basename(file) === "index.html")) {
    errors.push("docs/index.html missing");
  }
  for (const file of files) {
    const rel = path.relative(docsRoot, file).split(path.sep).join("/");
    if (rel !== "preview.html" && rel !== "preview.en.html" && (rel.startsWith("details/") || ROOT_PAGES.has(rel))) {
      indexable.push(file);
    }
    errors.push(...checkFile(docsRoot, file, titles, descriptions));
  }
  for (const [title, pages] of titles) {
    if (pages.length > 1) errors.push(`duplicate title "${title}" on ${pages.slice(0, 3).join(", ")}`);
  }
  for (const [description, pages] of descriptions) {
    if (pages.length > 1) errors.push(`duplicate description on ${pages.slice(0, 3).join(", ")}`);
  }
  errors.push(...checkSitemap(docsRoot, indexable));
  return errors;
}

const isMain = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (isMain) {
  const errors = checkSeo(path.resolve(process.argv[2] || "docs"));
  if (errors.length) {
    console.error(`SEO check failed (${errors.length})`);
    for (const error of errors.slice(0, 40)) console.error(`- ${error}`);
    if (errors.length > 40) console.error(`- ... and ${errors.length - 40} more`);
    process.exit(1);
  }
  console.log("SEO check passed");
}
