"use strict";

// Checkout uses Paddle's live environment.
const sequencerRelease = Object.freeze({
    checkoutEnabled: true,
    priceId: "pri_01m210wy3bpykyg09byjc1ame3"
});

document.body.classList.add("page-loaded");

// Keep YouTube disconnected until the visitor explicitly chooses to play.
document.querySelectorAll("[data-video-id]").forEach(link => {
    const videoId = link.dataset.videoId;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;
    link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const player = document.createElement("iframe");
        player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`;
        player.title = link.dataset.videoTitle || "Sequencer demonstration video";
        player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        player.allowFullscreen = true;
        player.referrerPolicy = "strict-origin-when-cross-origin";
        player.tabIndex = 0;
        link.replaceWith(player);
        player.focus();
    });
});

// Give all existing guide illustrations the same accessible image viewer.
document.querySelectorAll(".guide-image > img, .guide-control-card > img").forEach(image => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "image-zoom";
    button.dataset.zoom = "";
    button.setAttribute("aria-label", `Enlarge ${image.alt || "guide illustration"}`);
    image.before(button);
    button.append(image);
    image.loading = "lazy";
});

// Display the original interface captures, without altering the product UI.
const imageDialog = document.querySelector(".image-dialog");
if (imageDialog && typeof imageDialog.showModal === "function") {
    const dialogImage = imageDialog.querySelector(".dialog-image");
    const dialogCaption = imageDialog.querySelector(".dialog-caption");
    document.querySelectorAll("[data-zoom]").forEach(button => {
        button.addEventListener("click", () => {
            const source = button.querySelector("img");
            dialogImage.src = source.currentSrc || source.src;
            dialogImage.alt = source.alt;
            dialogCaption.textContent = source.alt;
            imageDialog.showModal();
            document.body.classList.add("dialog-open");
        });
    });
    imageDialog.querySelector(".dialog-close").addEventListener("click", () => imageDialog.close());
    imageDialog.addEventListener("click", event => {
        const bounds = imageDialog.getBoundingClientRect();
        if (event.target === imageDialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom)) imageDialog.close();
    });
    imageDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
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

const buyButton = document.getElementById("sequencer-buy");
if (buyButton && sequencerRelease.checkoutEnabled) {
    const status = document.getElementById("purchase-status");
    const paddleScript = document.createElement("script");
    paddleScript.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    paddleScript.onload = () => {
        try {
            window.Paddle.Initialize({
                token: "live_e2340a100db3ddedd42f4e6006c"
            });
            buyButton.disabled = false;
            buyButton.textContent = "Buy Sequencer — $29 USD";
            status.textContent = "Secure checkout is provided by Paddle. Your license key will be sent by email.";
            buyButton.addEventListener("click", () => {
                window.Paddle.Checkout.open({ items: [{ priceId: sequencerRelease.priceId, quantity: 1 }] });
            });
        } catch (error) {
            status.textContent = "Checkout could not load. Please refresh or contact support.";
        }
    };
    paddleScript.onerror = () => {
        status.textContent = "Checkout could not load. Please refresh or contact support.";
    };
    document.head.appendChild(paddleScript);
}

// Highlight the section currently being read without changing navigation.
const contents = document.querySelector(".guide-toc, .legal-sidebar");
if (contents && "IntersectionObserver" in window) {
    const links = [...contents.querySelectorAll('a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach(link => {
                if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        }
    }, { rootMargin: "-110px 0px -60% 0px" });
    document.querySelectorAll(".guide-section, .legal-content section").forEach(section => observer.observe(section));
}
