import apps from "./apps.json";
import appStoreBadge from "./badge.app-store.svg";
import googlePlayBadge from "./badge.google-play.svg";
import "./app.css";

type App = {
  name: string;
  icon: string;
  apkUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
};

const createElementFromHtml = (html: string) => {
  const templateElement = document.createElement("template");
  templateElement.innerHTML = html;
  return templateElement.content.firstChild;
};

const createLinkText = (link: { href: string, title: string }) => {
  const { title, href } = link;
  const a = document.createElement("a");

  a.innerText = title;
  a.href = href;

  return a;
};

const createLinkImage = (link: { href: string, src: string, alt: string }) => {
  const a = document.createElement("a");
  const img = document.createElement("img");

  img.src = link.src;
  img.alt = link.alt;
  a.href = link.href;
  a.appendChild(img);

  return a;
};

const render = (app: App) => {
  const { name, icon, apkUrl, playStoreUrl, appStoreUrl } = app;
  const template = `
    <div class="app">
      <h1>${name}</h1>
      <img src="${icon}" alt="${name}">
      <div class="android"></div>
    </div>
  `;
  const container = createElementFromHtml(template.trim()) as HTMLDivElement;

  if (playStoreUrl) {
    (container.querySelector(".android") as HTMLDivElement).appendChild(createLinkImage({
      href: playStoreUrl,
      src: googlePlayBadge,
      alt: "Download from Google Play"
    }));
  }

  if (apkUrl) {
    (container.querySelector(".android") as HTMLDivElement).appendChild(createLinkText({
      href: apkUrl,
      title: "Download .apk file"
    }));
  }

  if (appStoreUrl) {
    container.appendChild(createLinkImage({
      href: appStoreUrl,
      src: appStoreBadge,
      alt: "Download from App Store"
    }));
  }

  return container;
};

const { hash } = location;
const matches = hash.match(/^#([^\/]+)$/);

if (matches) {
  const appId = matches[1];
  const app: App = apps[appId];

  if (app) {
    document.title = app.name;
    (document.querySelector(".root") as HTMLDivElement).appendChild(render(app));
  }
}
