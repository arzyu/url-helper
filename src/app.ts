enum Platfrom {
  iOS,
  Android,
  AnZhuo
}

// TODO: replace the prefix urls
const storeUrlPrefix = {
  [Platfrom.iOS]: "https://play.google.com/store/apps/details?iOS&id=",
  [Platfrom.Android]: "https://play.google.com/store/apps/details?id=",
  [Platfrom.AnZhuo]: "https://play.google.com/store/apps/details?CN&id="
};

const storeUrl = (appId: string, platform: Platfrom) => `${storeUrlPrefix[platform]}${appId}`;

const testGoogle = (): Promise<boolean> => new Promise((resolve, reject) => {
  const testImage = new Image();

  testImage.onload = () => resolve(true);
  testImage.onerror = () => resolve(false);

  setTimeout(() => resolve(false), 2000);

  testImage.src = "https://youtube.com/favicon.ico";
});

const getStoreUrl = (appId: string): Promise<string> => new Promise((resolve, reject) => {
  const platform = navigator.userAgent.includes("iPhone OS")
      ? Platfrom.iOS : Platfrom.Android;

  if (platform === Platfrom.iOS) {
    resolve(storeUrl(appId, Platfrom.iOS));
  }

  testGoogle()
    .then(isGoogleAvailable => {
      if (isGoogleAvailable) {
        resolve(storeUrl(appId, Platfrom.Android));
      } else {
        resolve(storeUrl(appId, Platfrom.AnZhuo));
      }
    })
    .catch(error => {
      console.error(error);
      resolve(storeUrl(appId, Platfrom.Android));
    });
});

const { hash } = location;
const matches = hash.match(/^#(org\.arzx\.[^\/]+)$/);

if (matches) {
  const appId = matches[1];

  getStoreUrl(appId)
    .then(storeUrl => location.href = storeUrl)
    .catch(console.error);
}
