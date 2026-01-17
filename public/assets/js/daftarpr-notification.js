/**
 * Notification System for Daftar PR Dashboard
 * Final Version - Pending Approval Notifications
 */

class PendingApprovalNotification {
  constructor() {
    this.notificationElement = document.getElementById("pendingNotification");
    this.pendingCountElement = document.getElementById("pendingCount");
    this.closeButton = document.getElementById("closeNotification");
    this.currentCount = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadPendingCount();
  }

  setupEventListeners() {
    // Close button event
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.hideNotification();
      });
    }

    // Click on notification to filter pending items
    const notificationContent = this.notificationElement?.querySelector(
      ".notification-content"
    );
    if (notificationContent) {
      notificationContent.addEventListener("click", () => {
        this.filterPendingItems();
      });
    }

    // Auto-refresh every 2 minutes
    setInterval(() => {
      this.loadPendingCount();
    }, 120000);
  }

  async loadPendingCount() {
    try {
      // Simulate API call - replace with actual endpoint
      const pendingCount = await this.fetchPendingApprovals();

      this.updateNotification(pendingCount);

      // Update browser tab title if there are pending items
      this.updateTabTitle(pendingCount);
    } catch (error) {
      console.error("Error loading pending approvals:", error);
    }
  }

  async fetchPendingApprovals() {
    // Replace this with actual API call
    // Example: const response = await fetch('/api/pr/pending-count');
    // const data = await response.json();
    // return data.count;

    // Simulated data - remove this in production
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate random count between 0-10 for demo
        const randomCount = Math.floor(Math.random() * 11);
        resolve(randomCount);
      }, 500);
    });
  }

  updateNotification(count) {
    this.currentCount = count;

    if (this.pendingCountElement) {
      this.pendingCountElement.textContent = count;
    }

    if (count > 0) {
      this.showNotification();

      // Add pulse effect for attention
      const alertElement = this.notificationElement?.querySelector(
        ".notification-alert"
      );
      if (alertElement) {
        alertElement.classList.add("pulse");
      }

      // Show desktop notification if permitted
      this.showDesktopNotification(count);
    } else {
      this.hideNotification();
    }
  }

  showNotification() {
    if (this.notificationElement) {
      this.notificationElement.style.display = "block";

      // Trigger animation
      setTimeout(() => {
        this.notificationElement.style.opacity = "1";
        this.notificationElement.style.transform = "translateY(0)";
      }, 10);
    }
  }

  hideNotification() {
    if (this.notificationElement) {
      this.notificationElement.style.opacity = "0";
      this.notificationElement.style.transform = "translateY(-20px)";

      setTimeout(() => {
        this.notificationElement.style.display = "none";
      }, 500);
    }
  }

  filterPendingItems() {
    // Implement filter logic for pending items
    // This depends on your table implementation
    console.log("Filtering pending items...");

    // Example implementation:
    // const searchInput = document.getElementById('searchInput');
    // if (searchInput) {
    //     searchInput.value = 'status:pending';
    //     searchInput.dispatchEvent(new Event('input'));
    // }

    // Or trigger your existing filter function:
    // filterTableByStatus('pending');
  }

  updateTabTitle(count) {
    if (count > 0) {
      document.title = `(${count}) Daftar PR - Pending Approval`;
    } else {
      document.title = "Daftar PR";
    }
  }

  showDesktopNotification(count) {
    // Check if browser supports notifications and permission is granted
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification("Pending Approval Required", {
        body: `Anda memiliki ${count} PR menunggu persetujuan`,
        icon: "/favicon.ico",
        tag: "pending-approval",
      });
    } else if (Notification.permission === "default") {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.showDesktopNotification(count);
        }
      });
    }
  }

  // Public method to manually update count
  setPendingCount(count) {
    this.updateNotification(count);
  }

  // Public method to get current count
  getPendingCount() {
    return this.currentCount;
  }
}

// Initialize notification system when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.pendingNotification = new PendingApprovalNotification();

  // Example: Manual update (can be called from other parts of your app)
  // window.pendingNotification.setPendingCount(5);
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = PendingApprovalNotification;
}
