"use strict";
// Preserve the existing DWP Google Analytics property.
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag("js", new Date());
window.gtag("config", "G-9KQHGHMQ9Q");
const tag = document.createElement("script");
tag.async = true;
tag.src = "https://www.googletagmanager.com/gtag/js?id=G-9KQHGHMQ9Q";
document.head.appendChild(tag);
document.querySelectorAll("[data-download-platform]").forEach(link => {
    link.addEventListener("click", () => {
        window.gtag("event", "downloadBinary", {
            event_category: "Download", event_label: link.dataset.downloadPlatform,
            product: "Nexora", platform: link.dataset.downloadPlatform, transport_type: "beacon"
        });
    });
});
