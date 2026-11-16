export const SITE_ORIGIN = "https://wangchujiang.com/free-font/";

const UNSAFE = /[ #%&?+<>"]/g;

/** Keep Unicode paths readable. Encode only characters that break URLs. */
export function seoPath(pathname = "") {
  return String(pathname)
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => segment.replace(UNSAFE, (ch) => encodeURIComponent(ch)))
    .join("/");
}

export function canonicalUrl(pathname = "") {
  return SITE_ORIGIN + seoPath(pathname);
}

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function decodeSeoPath(pathname = "") {
  return String(pathname).split("/").map(decodeSegment).join("/");
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dayFromTime(ctime) {
  const time = Number(ctime);
  if (!Number.isFinite(time) || time <= 0) return "";
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function touch(latest, pathname, ctime) {
  const day = dayFromTime(ctime);
  if (!day) return;
  if (!latest[pathname] || latest[pathname] < day) latest[pathname] = day;
}

function pageLastMods(datas) {
  const latest = Object.create(null);
  const typePages = {
    黑体: "hei.html",
    楷体: "kai.html",
    宋体: "song.html",
    艺术体: "art.html",
    手绘体: "handwriting.html",
  };
  for (const item of datas) {
    if (!item?.name) continue;
    touch(latest, `details/${item.name}.html`, item.ctime);
    touch(latest, "index.html", item.ctime);
    if (item.type && typePages[item.type]) touch(latest, typePages[item.type], item.ctime);
    const fontPath = String(item.path || "");
    if (fontPath.includes("/english/") || fontPath.includes("\\english\\")) {
      touch(latest, "english.html", item.ctime);
    }
    if (item.home && (item.home.includes("github.com") || item.home.includes("gitlab.com"))) {
      touch(latest, "open-source.html", item.ctime);
    }
  }
  return latest;
}

function isPreviewUrl(url) {
  if (!url.startsWith(SITE_ORIGIN)) return false;
  const pathname = decodeSeoPath(url.slice(SITE_ORIGIN.length).split("?")[0]);
  return pathname === "preview.html" || pathname === "preview.en.html";
}

export function buildSitemap(sitemapText, datas) {
  const urls = [
    ...new Set(
      String(sitemapText || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("http"))
        .map((line) => line.split("?")[0])
        .map((url) => {
          if (!url.startsWith(SITE_ORIGIN)) return url;
          return canonicalUrl(decodeSeoPath(url.slice(SITE_ORIGIN.length)));
        })
        .filter((url) => !isPreviewUrl(url)),
    ),
  ].sort((a, b) => a.localeCompare(b, "zh"));

  const lastmod = pageLastMods(datas);
  const body = urls
    .map((loc) => {
      const key = loc.startsWith(SITE_ORIGIN) ? decodeSeoPath(loc.slice(SITE_ORIGIN.length)) : "";
      const day = lastmod[key];
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${day ? `\n    <lastmod>${day}</lastmod>` : ""}\n  </url>`;
    })
    .join("\n");
  return {
    txt: `${urls.join("\n")}\n`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  };
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}sitemap.xml\n`;
}
