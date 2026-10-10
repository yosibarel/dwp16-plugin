"use strict";

// Live checkout enabled for a user-requested real purchase test.
const riftRelease = Object.freeze({
    checkoutEnabled: true,
    priceId: "pri_01m4ky03ks9zbt3yxt1987e2bp"
});

document.body.classList.add("page-loaded");
const buyButton = document.getElementById("rift-buy");
if (buyButton && riftRelease.checkoutEnabled) {
    const status = document.getElementById("purchase-status");
    const paddleScript = document.createElement("script");
    paddleScript.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    paddleScript.onload = () => {
        try {
            window.Paddle.Initialize({ token: "live_e2340a100db3ddedd42f4e6006c" });
            buyButton.disabled = false;
            buyButton.textContent = "Buy Rift";
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
