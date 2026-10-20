"use strict";

// Independent DWP-16 homepage interactions; no checkout or other product code.
document.querySelectorAll(".guide-image > img").forEach(image => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "image-zoom";
    button.dataset.zoom = "";
    button.setAttribute("aria-label", `Enlarge ${image.alt || "guide illustration"}`);
    image.before(button);
    button.append(image);
    image.loading = "lazy";
});
const dwpImageDialog = document.querySelector(".image-dialog");
if (dwpImageDialog && typeof dwpImageDialog.showModal === "function") {
    const image = dwpImageDialog.querySelector(".dialog-image");
    const caption = dwpImageDialog.querySelector(".dialog-caption");
    document.querySelectorAll("[data-zoom]").forEach(button => {
        button.addEventListener("click", () => {
            const source = button.querySelector("img");
            image.src = source.currentSrc || source.src;
            image.alt = source.alt;
            caption.textContent = source.alt;
            dwpImageDialog.showModal();
            document.body.classList.add("dialog-open");
        });
    });
    dwpImageDialog.querySelector(".dialog-close").addEventListener("click", () => dwpImageDialog.close());
    dwpImageDialog.addEventListener("click", event => {
        const bounds = dwpImageDialog.getBoundingClientRect();
        if (event.target === dwpImageDialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom)) dwpImageDialog.close();
    });
    dwpImageDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
} else {
    document.querySelectorAll("[data-zoom]").forEach(button => {
        button.addEventListener("click", () => window.open(button.querySelector("img").src, "_blank", "noopener"));
    });
}
document.querySelectorAll(".products-menu").forEach(menu => {
    document.addEventListener("click", event => {
        if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            menu.open = false;
            menu.querySelector("summary").focus();
        }
    });
});
document.querySelectorAll("[data-video-id]").forEach(link => {
    link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const player = document.createElement("iframe");
        player.src = `https://www.youtube-nocookie.com/embed/${link.dataset.videoId}?autoplay=1&playsinline=1`;
        player.title = "DWP-16 demonstration";
        player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        player.allowFullscreen = true;
        player.referrerPolicy = "strict-origin-when-cross-origin";
        link.replaceWith(player);
        player.focus();
    });
});
document.querySelectorAll("[data-download-platform]").forEach(link => {
    link.addEventListener("click", () => {
        if (typeof window.gtag === "function") window.gtag("event", "downloadBinary", {
            event_category: "Download", event_label: link.dataset.downloadPlatform,
            transport_type: "beacon"
        });
    });
});
const guideLinks = [...document.querySelectorAll(".manual-contents a")];
if (guideLinks.length) {
    const chapters = [...document.querySelectorAll(".guide-section")];
    let scheduled = false;
    const updateGuideChapter = () => {
        scheduled = false;
        let current = chapters[0];
        chapters.forEach(chapter => {
            if (chapter.getBoundingClientRect().top <= 160) current = chapter;
        });
        guideLinks.forEach(link => {
            if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    };
    const scheduleGuideUpdate = () => {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(updateGuideChapter);
        }
    };
    window.addEventListener("scroll", scheduleGuideUpdate, { passive: true });
    window.addEventListener("resize", scheduleGuideUpdate);
    updateGuideChapter();
}
// Preserve the existing Google property in production; do not track local QA.
if (!["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) && location.protocol !== "file:") {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", "G-9KQHGHMQ9Q");
    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = "https://www.googletagmanager.com/gtag/js?id=G-9KQHGHMQ9Q";
    document.head.appendChild(googleTag);
}
