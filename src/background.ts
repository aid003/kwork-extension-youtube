import browser from "webextension-polyfill";

console.log("Hello from the background!");

/*───────────────────────────────────────────────────────────
 *  1. Приём транскриптов от content-script
 *──────────────────────────────────────────────────────────*/
browser.runtime.onMessage.addListener((msg, _sender) => {
  if (msg?.type === "video-transcript") {
    // msg.videoId  – ID ролика
    // msg.transcript – полный текст субтитров
    console.log(
      "[Transcript]",
      msg.videoId,
      (msg.transcript ?? "").slice(0, 120) + "…"
    );
    /* здесь можно дополнительно:
       • сохранить текст в storage
       • отправить на свой сервер
       • отправить natively-hosted app и т.д. */
  }
  /* callback не нужен, поэтому ничего не возвращаем */
});

/*───────────────────────────────────────────────────────────
 *  2. Обработка установки / обновления расширения
 *──────────────────────────────────────────────────────────*/
browser.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed:", details);

  if (details.reason === "install" || details.reason === "update") {
    // Открываем welcome-страницу
    browser.tabs.create({
      url: browser.runtime.getURL("/welcome.html"),
    });

    // Находим все открытые вкладки YouTube и перезагружаем их,
    // чтобы контент-скрипт сразу подхватился
    const ytTabs = await browser.tabs.query({
      url: "*://*.youtube.com/*",
    });

    for (const tab of ytTabs) {
      if (tab.id) {
        await browser.tabs.reload(tab.id);
      }
    }
  }
});
