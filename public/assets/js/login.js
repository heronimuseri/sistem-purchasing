// public/js/login.js (Final dengan perbaikan .trim() pada password)
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginData = {
      company: document.getElementById("company").value.trim(),
      user: document.getElementById("user").value.trim(),
      // ## PERBAIKAN DI SINI: Tambahkan .trim() pada password ##
      password: document.getElementById("password").value.trim(),
    };

    if (!loginData.company || !loginData.user || !loginData.password) {
      return alert("Lengkapi semua field.");
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem("userRole", result.user.role);
        localStorage.setItem("userName", result.user.name);

        console.log("Login success, role:", result.user.role);
        if (result.user.role === "admin") {
          window.location.href = "/admin.html";
        } else {
          window.location.href = "/dashboard.html";
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Tidak dapat terhubung ke server. Pastikan server sudah berjalan.");
    }
  });
