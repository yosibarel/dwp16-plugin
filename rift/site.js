"use strict";

// Live checkout enabled for a user-requested real purchase test.
const riftRelease = Object.freeze({
    checkoutEnabled: true,
    priceId: "pri_01m4ky03ks9zbt3yxt1987e2bp"
});

document.body.classList.add("page-loaded");

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

const buyButton = document.getElementById("rift-buy");
if (buyButton && riftRelease.checkoutEnabled) {
    const status = document.getElementById("purchase-status");
    const paddleScript = document.createElement("script");
    paddleScript.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    paddleScript.onload = () => {
        try {
            window.Paddle.Initialize({ token: "live_e2340a100db3ddedd42f4e6006c" });
            buyButton.disabled = false;
            buyButton.textContent = "Buy Rift — $59 USD";
            status.textContent = "Secure checkout is provided by Paddle. Your license key will be sent by email.";
            buyButton.addEventListener("click", () => {
                window.Paddle.Checkout.open({ items: [{ priceId: riftRelease.priceId, quantity: 1 }] });
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
