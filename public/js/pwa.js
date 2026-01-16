// public/js/pwa.js - Premium PWA Solution with Dynamic UI
// VAPID Key: GANTI_DENGAN_VAPID_PUBLIC_KEY_BACKEND_ANDA

class PWAHelper {
  constructor() {
    this.VAPID_PUBLIC_KEY = "GANTI_DENGAN_VAPID_PUBLIC_KEY_BACKEND_ANDA";
    this.serviceWorker = null;
    this.deferredPrompt = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    console.log("PWA Helper: Initializing v2.0 (Premium UI)...");

    // 1. Register Service Worker
    await this.registerServiceWorker();

    // 2. Setup Core Features
    this.setupUpdateListener();
    this.setupOfflineDetection();
    this.setupInstallPrompt();

    // 3. Initialize Push Notifications (only for approvers)
    await this.initializePushNotifications();

    this.isInitialized = true;
    console.log("PWA Helper: Initialization complete");
  }

  // ==================== SERVICE WORKER & CORE PWA ====================

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorker = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log(
          "Service Worker registered successfully:",
          this.serviceWorker
        );

        // Listen for updates
        this.serviceWorker.addEventListener("updatefound", () => {
          const newWorker = this.serviceWorker.installing;
          console.log("New Service Worker found...");

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New content is available; please refresh.");
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  setupUpdateListener() {
    let refreshing = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  // ==================== PUSH NOTIFICATIONS ====================

  async initializePushNotifications() {
    // Only initialize for approvers who are logged in
    const userRole = localStorage.getItem("userRole");
    if (
      !localStorage.getItem("userName") ||
      (userRole !== "ktu" && userRole !== "manager")
    ) {
      return;
    }

    // Check notification permission
    if (Notification.permission === "default") {
      console.log("PWA Init: Requesting notification permission...");
      const granted = await this.requestNotificationPermission();
      if (!granted) return;
    } else if (Notification.permission === "denied") {
      console.warn("PWA Init: Notification permission denied by user.");
      return;
    }

    // Subscribe to push if permission granted
    if (Notification.permission === "granted") {
      await this.subscribeUserToPush();
    }
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  async subscribeUserToPush() {
    // Validate VAPID Key
    if (
      !this.VAPID_PUBLIC_KEY ||
      this.VAPID_PUBLIC_KEY.includes("GANTI_DENGAN")
    ) {
      console.error("VAPID_PUBLIC_KEY is not configured in pwa.js!");
      return;
    }

    if (!this.serviceWorker) {
      console.error("Service Worker is not registered.");
      return;
    }

    try {
      let subscription = await this.serviceWorker.pushManager.getSubscription();

      if (!subscription) {
        console.log("Creating new push subscription...");
        subscription = await this.serviceWorker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlB64ToUint8Array(this.VAPID_PUBLIC_KEY),
        });
      } else {
        console.log("Using existing push subscription.");
      }

      await this.sendSubscriptionToBackEnd(subscription);
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
    }
  }

  async sendSubscriptionToBackEnd(subscription) {
    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Bad response from server while saving subscription.");
      }
      console.log("Subscription sent to backend successfully.");
    } catch (error) {
      console.error("Error sending subscription to backend:", error);
    }
  }

  // ==================== INSTALL PROMPT ====================

  setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;

      this.showInstallPrompt();

      setTimeout(() => {
        if (this.deferredPrompt) {
          this.showInstallPrompt();
        }
      }, 30000);
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA installed successfully");
      this.deferredPrompt = null;
      this.showToast("Aplikasi berhasil diinstal!", "success");
    });
  }

  showInstallPrompt() {
    if (this.shouldShowInstallPrompt()) {
      // Remove existing prompt if any
      this.dismissInstallPrompt();

      const installHtml = `
                <div id="install-prompt" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    border: 2px solid #0ea5e9;
                    border-radius: 10px;
                    padding: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 10000;
                    max-width: 300px;
                    font-family: system-ui, -apple-system, sans-serif;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #0ea5e9; font-size: 16px;">
                        <i class="fas fa-download"></i> Install App
                    </h4>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">
                        Install aplikasi untuk pengalaman yang lebih baik
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button id="pwa-install-btn" style="
                            background: #0ea5e9;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                            font-size: 14px;
                        ">Install</button>
                        <button id="pwa-dismiss-btn" style="
                            background: #6b7280;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Nanti</button>
                    </div>
                </div>
            `;

      document.body.insertAdjacentHTML("beforeend", installHtml);

      // Attach event listeners (CSP-compliant - no inline handlers)
      const installBtn = document.getElementById("pwa-install-btn");
      const dismissBtn = document.getElementById("pwa-dismiss-btn");

      if (installBtn) {
        installBtn.addEventListener("click", () => this.installApp());
      }
      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => this.dismissInstallPrompt());
      }
    }
  }

  shouldShowInstallPrompt() {
    // Don't show if already installed (running as standalone app)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return false;
    }

    // Check if running as iOS standalone
    if (window.navigator.standalone === true) {
      return false;
    }

    // Allow install prompt on all devices including mobile
    return true;
  }

  async installApp() {
    console.log("PWA: installApp called, deferredPrompt =", this.deferredPrompt);

    if (this.deferredPrompt) {
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
          this.showToast("Menginstal aplikasi...", "success");
        } else {
          console.log("User dismissed the install prompt");
          this.showToast("Instalasi dibatalkan", "info");
        }
        this.deferredPrompt = null;
        this.dismissInstallPrompt();
      } catch (error) {
        console.error("Install error:", error);
        this.showInstallInstructions();
      }
    } else {
      console.log("PWA: No deferredPrompt available, showing instructions");
      this.showInstallInstructions();
    }
  }

  showInstallInstructions() {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSamsung = /SamsungBrowser/.test(navigator.userAgent);

    let instructions = "";
    let duration = 6000;

    if (isIOS) {
      instructions = 'Tap tombol Share (kotak dengan panah ke atas) lalu pilih "Add to Home Screen"';
      this.showIOSInstallGuide();
    } else if (isSamsung) {
      instructions = 'Buka menu (⋮) dan pilih "Add page to" → "Home screen"';
      this.showToast(`Untuk install: ${instructions}`, "info", duration);
    } else if (isAndroid) {
      instructions = 'Buka menu browser (⋮) dan pilih "Install app" atau "Add to Home screen"';
      this.showToast(`Untuk install: ${instructions}`, "info", duration);
    } else {
      instructions = "Klik ikon Install di address bar browser atau gunakan menu browser";
      this.showToast(`Untuk install: ${instructions}`, "info", duration);
    }

    this.dismissInstallPrompt();
  }

  showIOSInstallGuide() {
    // Remove existing guide if any
    const existingGuide = document.getElementById("ios-install-guide");
    if (existingGuide) existingGuide.remove();

    const guideHtml = `
      <div id="ios-install-guide" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        z-index: 10001;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      ">
        <h4 style="margin: 0 0 10px 0; font-size: 16px;">📲 Install SPA Purchasing</h4>
        <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
          Tap <strong style="font-size: 18px;">⎋</strong> (Share) lalu <strong>"Add to Home Screen"</strong>
        </p>
        <button id="ios-guide-close-btn" style="
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">Mengerti</button>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", guideHtml);

    // CSP-compliant event handler
    const closeBtn = document.getElementById("ios-guide-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const guide = document.getElementById("ios-install-guide");
        if (guide) guide.remove();
      });
    }
  }

  dismissInstallPrompt() {
    const prompt = document.getElementById("install-prompt");
    if (prompt) {
      prompt.remove();
    }
  }

  // ==================== OFFLINE DETECTION ====================

  setupOfflineDetection() {
    window.addEventListener("online", () => {
      this.showOnlineMessage();
      this.syncPendingData();
    });

    window.addEventListener("offline", () => {
      this.showOfflineMessage();
    });

    // Initial check
    if (!navigator.onLine) {
      this.showOfflineMessage();
    }
  }

  showOnlineMessage() {
    this.showToast("Koneksi internet kembali pulih", "success");
  }

  showOfflineMessage() {
    this.showToast(
      "Anda sedang offline. Beberapa fitur mungkin terbatas.",
      "warning"
    );
  }

  // ==================== BACKGROUND SYNC & DATA MANAGEMENT ====================

  async syncPendingData() {
    console.log("Syncing pending data...");
    const pendingSubmissions = this.getPendingSubmissions();

    for (const submission of pendingSubmissions) {
      try {
        await this.submitFormData(submission);
        this.removePendingSubmission(submission.id);
        this.showToast("Data berhasil disinkronisasi", "success");
      } catch (error) {
        console.error("Failed to sync submission:", error);
      }
    }
  }

  getPendingSubmissions() {
    return JSON.parse(localStorage.getItem("pendingSubmissions") || "[]");
  }

  savePendingSubmission(data) {
    const pending = this.getPendingSubmissions();
    pending.push({
      id: Date.now(),
      data: data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("pendingSubmissions", JSON.stringify(pending));
    this.showToast("Data disimpan untuk sinkronisasi nanti", "info");
  }

  removePendingSubmission(id) {
    const pending = this.getPendingSubmissions();
    const filtered = pending.filter((item) => item.id !== id);
    localStorage.setItem("pendingSubmissions", JSON.stringify(filtered));
  }

  async submitFormData(submission) {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission.data),
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    return response.json();
  }

  // ==================== NOTIFICATION & UI UTILITIES ====================

  showUpdateNotification() {
    if (
      confirm("Versi baru tersedia! Muat ulang untuk memperbarui aplikasi?")
    ) {
      window.location.reload();
    }
  }

  showToast(message, type = "info", duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll(".pwa-toast");
    existingToasts.forEach((toast) => toast.remove());

    const toast = document.createElement("div");
    toast.className = "pwa-toast";
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            animation: toastSlideIn 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
        `;

    toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span style="font-size: 14px;">${message}</span>
            </div>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "toastSlideOut 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  getToastColor(type) {
    const colors = {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    };
    return colors[type] || colors.info;
  }

  getToastIcon(type) {
    const icons = {
      success: "check-circle",
      warning: "exclamation-triangle",
      error: "exclamation-circle",
      info: "info-circle",
    };
    return icons[type] || icons.info;
  }

  // ==================== PWA STATUS & INFO ====================

  isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  getPWAStatus() {
    return {
      isStandalone: this.isStandalone(),
      isOnline: navigator.onLine,
      serviceWorker: !!this.serviceWorker,
      pushSupported: "PushManager" in window,
      storage: {
        usage: this.getStorageUsage(),
        quota: this.getStorageQuota(),
      },
    };
  }

  async getStorageUsage() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage;
    }
    return null;
  }

  async getStorageQuota() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.quota;
    }
    return null;
  }

  // ==================== HELPER FUNCTIONS ====================

  urlB64ToUint8Array(base64String) {
    try {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (e) {
      console.error("Error converting VAPID key:", e);
      return new Uint8Array();
    }
  }
}

// Initialize PWA Helper
const pwaHelper = new PWAHelper();

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes toastSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes toastSlideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
window.pwaHelper = pwaHelper;

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  pwaHelper.init().catch((error) => {
    console.error("PWA initialization failed:", error);
  });
});
