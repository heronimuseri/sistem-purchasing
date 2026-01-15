// public/js/edit_user.js (Final dengan field Company ID)

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId) {
    alert("ID User tidak ditemukan!");
    window.location.href = "admin_user.html";
    return;
  }

  fetchUserData(userId);

  const form = document.getElementById("edit-user-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit(userId);
    });
  }
});

async function fetchUserData(id) {
  const loadingText = document.getElementById("loading-text");
  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || "Gagal memuat data user.");
    }
    const user = await response.json();

    document.getElementById("user-id").value = user.id;
    document.getElementById("user-name").value = user.name;
    // TAMBAHKAN BARIS INI UNTUK MENGISI COMPANY ID
    document.getElementById("user-company").value = user.company;
    document.getElementById("user-userid").value = user.user;
    document.getElementById("user-role").value = user.role;

    document.getElementById("form-content").classList.remove("hidden");
    loadingText.classList.add("hidden");
  } catch (error) {
    loadingText.textContent = `Error: ${error.message}`;
    loadingText.style.color = "red";
  }
}

async function handleFormSubmit(id) {
  const updatedUserData = {
    name: document.getElementById("user-name").value,
    // TAMBAHKAN BARIS INI UNTUK MENGIRIM COMPANY ID
    company: document.getElementById("user-company").value,
    user: document.getElementById("user-userid").value,
    role: document.getElementById("user-role").value,
    pass: document.getElementById("user-password").value,
  };

  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedUserData),
    });
    const result = await response.json();
    alert(result.message);

    if (result.success) {
      window.location.href = "admin_user.html";
    }
  } catch (error) {
    alert("Terjadi kesalahan saat menyimpan data.");
    console.error("Update error:", error);
  }
}
