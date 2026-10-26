"use strict";

// Use the same Google Analytics property as the other DWP products.
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag("js", new Date());
window.gtag("config", "G-9KQHGHMQ9Q");

const riftGoogleTag = document.createElement("script");
riftGoogleTag.async = true;
riftGoogleTag.src = "https://www.googletagmanager.com/gtag/js?id=G-9KQHGHMQ9Q";
document.head.appendChild(riftGoogleTag);

// Track download clicks without delaying or replacing normal link navigation.
const riftDownloadPlatforms = {
    "RiftInstaller.pkg": "macOS",
    "RiftRemote.apk": "Android"
};
document.querySelectorAll('a[href*="/Rift-Releases/releases/download/"]').forEach(link => {
    const fileName = new URL(link.href).pathname.split("/").pop();
    const platform = /^Rift-\d+\.\d+\.\d+-Windows\.zip$/.test(fileName)
        ? "Windows"
        : riftDownloadPlatforms[fileName];
    if (!platform) return;
    link.addEventListener("click", () => {
        window.gtag("event", "downloadBinary", {
            event_category: "Download",
            event_label: `Rift ${platform}`,
            product: "Rift",
            platform,
            file_name: fileName,
            transport_type: "beacon"
        });
    });
});

const riftTrackedCheckouts = new Set();
window.riftTrackCheckout = function (event, priceId) {
    if (!event || !["checkout.loaded", "checkout.completed"].includes(event.name)) return;
    const data = event.data;
    if (!data || !Array.isArray(data.items) || !data.currency_code) return;
    const items = data.items.filter(item => item.price_id === priceId).map(item => ({
        item_id: item.price_id,
        item_name: "Rift",
        quantity: item.quantity,
        price: (item.totals.subtotal - item.totals.discount) / item.quantity
    }));
    if (!items.length || items.some(item => !Number.isFinite(item.price) || item.price < 0 ||
        !Number.isInteger(item.quantity) || item.quantity < 1)) return;
    const eventName = event.name === "checkout.completed" ? "purchase" : "begin_checkout";
    const id = eventName === "purchase" ? data.transaction_id : data.id;
    if (!id) return;
    const key = `${eventName}:${id}`;
    if (riftTrackedCheckouts.has(key)) return;
    const parameters = {
        currency: data.currency_code,
        value: items.reduce((total, item) => total + item.price * item.quantity, 0),
        items
    };
    if (eventName === "purchase") {
        parameters.transaction_id = id;
        parameters.tax = data.totals.tax;
    }
    // Deliberately exclude customer email, billing address and payment details.
    window.gtag("event", eventName, parameters);
    riftTrackedCheckouts.add(key);
};
