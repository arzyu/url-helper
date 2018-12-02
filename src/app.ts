import Mustache from "mustache";

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
  const template = `
    <div class="app">
      <h1>{{name}}</h1>
      <div class="logo"><img src="{{icon}}" alt="{{name}}"></div>
      {{#android}}
      <ul class="platform android">
        {{#playStoreUrl}}
        <li><a href="{{playStoreUrl}}"><img src="${googlePlayBadge}" alt="Download from Google Play"></a></li>
        {{/playStoreUrl}}
        {{#apkUrl}}<li><a href="{{apkUrl}}">Download <code>.apk</code> file</a></li>{{/apkUrl}}
      </ul>
      {{/android}}
      {{#ios}}
      <ul class="platform ios">
        {{#appStoreUrl}}
        <li><a href="{{appStoreUrl}}"><img src="${appStoreBadge}" alt="Download from App Store"></a></li>
        {{/appStoreUrl}}
      </ul>
      {{/ios}}
    </div>
  `;
  const view = Object.assign({}, app, {
    android: () => Boolean(app.apkUrl || app.playStoreUrl),
    ios: () => Boolean(app.appStoreUrl)
  });

  return Mustache.render(template, view);
};

const { hash } = location;
const matches = hash.match(/^#([^\/]+)$/);

if (matches) {
  const appId = matches[1];
  const app: App = apps[appId];

  if (app) {
    document.title = app.name;
    (document.querySelector(".root") as HTMLDivElement).innerHTML = render(app);
  }
}
