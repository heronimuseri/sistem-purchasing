// admin.js (Final dengan Perbaikan Error 500/PUT)

document.addEventListener("DOMContentLoaded", () => {
  // ======================================================================
  // NAVIGATION LOGIC (Switching Sections & State Persistence)
  // ======================================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const contentSections = document.querySelectorAll(".content-section");
  const LOCAL_STORAGE_KEY = "activeAdminSection";

  function switchSection(targetId) {
    if (!document.getElementById(targetId)) {
      console.warn(
        `Target section "${targetId}" not found. Defaulting to content-main.`
      );
      targetId = "content-main";
    }

    contentSections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });

    navLinks.forEach((link) => {
      if (link.getAttribute("data-target") === targetId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, targetId);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("data-target");
      if (targetId) {
        e.preventDefault();
        switchSection(targetId);
      }
    });
  });

  const initialSection =
    localStorage.getItem(LOCAL_STORAGE_KEY) || "content-main";
  switchSection(initialSection);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Anda yakin ingin logout?")) {
        console.log("Logging out...");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.location.href = "/login.html";
      }
    });
  }

  // ======================================================================
  // HELPER FUNCTIONS
  // ======================================================================

  function showNotification(elementId, message, type) {
    const notification = document.getElementById(elementId);
    if (!notification) return;
    notification.textContent = message;
    notification.className = "notification " + type;
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  function isValidWaNumber(number) {
    return /^62\d{9,13}$/.test(number);
  }

  // ======================================================================
  // MASTER USER MANAGEMENT (CRUD via API)
  // ======================================================================
  const formUser = document.getElementById("form-user");
  const userIdInput = document.getElementById("user-id");
  const userCompanyHiddenInput = document.getElementById("user-company-hidden"); // NEW: Hidden input for company
  const userNameInput = document.getElementById("user-name");
  const userUsernameInput = document.getElementById("user-username");
  const userPasswordInput = document.getElementById("user-password");
  const userRoleSelect = document.getElementById("user-role");
  const userWaInput = document.getElementById("user-wa");
  const userTableBody = document.getElementById("user-table-body");
  const userFormTitle = document.getElementById("user-form-title");
  const btnCancelEdit = document.getElementById("btn-cancel-edit");
  const passwordModal = document.getElementById("password-modal");
  const editPasswordUserIdInput = document.getElementById(
    "edit-password-user-id"
  );
  const editPasswordUsernameDisplay = document.getElementById(
    "edit-password-username-display"
  );
  const formEditPassword = document.getElementById("form-edit-password");

  let users = [];

  // FUNGSI UNTUK MEMUAT DATA USER DARI API
  async function fetchUsers() {
    try {
      // PERBAIKAN: SESUAIKAN ENDPOINT DENGAN server.js: /api/admin/users
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Sesi kadaluarsa atau akses ditolak. Coba login ulang."
          );
        }
        throw new Error("Gagal memuat data user dari server.");
      }
      users = await response.json();
      renderUsers();
    } catch (error) {
      console.error("Error loading users:", error);
      showNotification(
        "user-notification",
        error.message || "Gagal memuat data user. Cek koneksi API.",
        "error"
      );
    }
  }

  // Fungsi untuk menampilkan data user ke tabel
  function renderUsers() {
    if (!userTableBody) return;
    userTableBody.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.company || "-"}</td>  
                <td>${user.user || "N/A"}</td>     
                <td>${user.role}</td>
                <td>${user.wa_number || "N/A"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" data-user-action="edit" data-id="${
                          user.id
                        }">Edit</button>
                        <button class="btn btn-secondary btn-sm" data-user-action="edit-password" data-id="${
                          user.id
                        }">Pass</button> 
                        <button class="btn btn-danger btn-sm" data-user-action="delete" data-id="${
                          user.id
                        }">Hapus</button>
                    </div>
                </td>
            `;
      userTableBody.appendChild(row);
    });
  }

  // Fungsi untuk mereset form user
  function resetUserForm() {
    if (!formUser) return;
    formUser.reset();
    userIdInput.value = "";
    userCompanyHiddenInput.value = ""; // Clear hidden company field
    if (userFormTitle) userFormTitle.textContent = "Tambah User Baru";
    if (btnCancelEdit) btnCancelEdit.style.display = "none";
    userPasswordInput.setAttribute("required", "required");
  }

  // Handle Form Submit (Add atau Edit)
  if (formUser) {
    formUser.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = userIdInput.value;
      const name = userNameInput.value.trim();
      const username = userUsernameInput.value.trim();
      const password = userPasswordInput.value;
      const role = userRoleSelect.value;
      const waNumber = userWaInput.value.trim();
      const company = userCompanyHiddenInput.value.trim(); // Get company for PUT/Edit

      if (!name || !username || !role || !waNumber || (!id && !password)) {
        showNotification(
          "user-notification",
          "Semua field wajib diisi (Password wajib saat Tambah User Baru).",
          "error"
        );
        return;
      }

      if (!isValidWaNumber(waNumber)) {
        showNotification(
          "user-notification",
          "Format Nomor WA salah. Harus diawali 62.",
          "error"
        );
        return;
      }

      // Payload data yang dikirim ke API
      const userData = {
        name,
        user: username,
        role,
        waNumber,
        pass: password, // Kirim password (hanya digunakan saat POST)
        company: company || "SPA_70", // PERBAIKAN KRITIS: Default ke SPA_70 jika POST, atau gunakan nilai dari hidden field saat PUT
      };

      let url = "/api/admin/users";
      let method = "POST";

      if (id) {
        url = `/api/admin/users/${id}`;
        method = "PUT";
        // Hapus password agar tidak di-hash saat UPDATE data user biasa
        delete userData.pass;
      } else {
        // Hapus company jika POST (asumsi company diisi default di backend atau tidak diperlukan)
        // Kita biarkan saja company: 'SPA_70' sesuai di atas
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Gagal menyimpan data user (Status: ${response.status}).`
          );
        }

        const message = id
          ? "User berhasil diperbarui di database."
          : "User berhasil ditambahkan ke database.";
        showNotification("user-notification", message, "success");

        await fetchUsers();
        resetUserForm();
      } catch (error) {
        console.error("Error saat menyimpan/memperbarui user:", error);
        showNotification(
          "user-notification",
          error.message || "Terjadi error koneksi API.",
          "error"
        );
      }
    });
  }

  // Handle Batal Edit
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", resetUserForm);
  }

  // Fungsi Edit User
  function editUser(id) {
    const user = users.find((user) => user.id == id);
    if (user) {
      userIdInput.value = user.id;
      userCompanyHiddenInput.value = user.company; // KRITIS: Simpan company ke hidden field
      userNameInput.value = user.name;
      userUsernameInput.value = user.user;
      userRoleSelect.value = user.role;
      userWaInput.value = user.wa_number;
      userPasswordInput.value = "";
      userPasswordInput.removeAttribute("required");

      if (userFormTitle) userFormTitle.textContent = "Edit User";
      if (btnCancelEdit) btnCancelEdit.style.display = "inline-block";
      if (formUser)
        formUser.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Fungsi Hapus User (DIPERBAIKI ENDPOINT)
  function deleteUser(id) {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus user ini? (Operasi ini akan menghapus dari database)"
      )
    ) {
      console.log("Mengirim permintaan DELETE untuk user ID:", id);

      fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Gagal menghapus user di server."
            );
          }

          showNotification(
            "user-notification",
            "User berhasil dihapus dari database.",
            "success"
          );

          await fetchUsers();

          if (userIdInput.value == id) {
            resetUserForm();
          }
        })
        .catch((error) => {
          console.error("Error saat menghapus user:", error);
          showNotification(
            "user-notification",
            error.message || "Terjadi error koneksi API saat menghapus.",
            "error"
          );
        });
    }
  }

  // ======================================================================
  // FUNGSI EDIT PASSWORD
  // ======================================================================

  // Menampilkan Modal Edit Password
  function openPasswordModal(id) {
    const user = users.find((u) => u.id == id);
    if (user) {
      editPasswordUserIdInput.value = user.id;
      editPasswordUsernameDisplay.textContent = user.user;
      passwordModal.style.display = "block";
      document.getElementById("form-edit-password").reset();
      showNotification("password-notification", "", "");
    }
  }

  // Menutup Modal Edit Password
  function closePasswordModal() {
    passwordModal.style.display = "none";
  }

  // Handle Submit Edit Password
  if (formEditPassword) {
    formEditPassword.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = editPasswordUserIdInput.value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (newPassword !== confirmPassword) {
        showNotification(
          "password-notification",
          "Password baru dan konfirmasi tidak cocok.",
          "error"
        );
        return;
      }

      if (newPassword.length < 6) {
        showNotification(
          "password-notification",
          "Password minimal 6 karakter.",
          "error"
        );
        return;
      }

      // Kirim ke API khusus untuk update password
      try {
        const response = await fetch(`/api/admin/users/${id}/password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Gagal mengubah password di server."
          );
        }

        showNotification(
          "password-notification",
          "Password berhasil diubah!",
          "success"
        );
        setTimeout(closePasswordModal, 1500);
      } catch (error) {
        console.error("Error saat mengubah password:", error);
        showNotification(
          "password-notification",
          error.message || "Terjadi error API saat ubah password.",
          "error"
        );
      }
    });
  }

  // Tutup modal ketika tombol 'x' diklik
  const closeButton = passwordModal.querySelector(".close-button");
  if (closeButton) {
    closeButton.onclick = closePasswordModal;
  }

  // Tutup modal ketika klik di luar area modal
  window.onclick = function (event) {
    if (event.target == passwordModal) {
      closePasswordModal();
    }
  };

  // Event Delegation untuk tombol aksi di tabel
  if (userTableBody) {
    userTableBody.addEventListener("click", (e) => {
      const target = e.target.closest("button[data-user-action]");
      if (!target) return;

      const action = target.getAttribute("data-user-action");
      const id = parseInt(target.getAttribute("data-id"));

      if (action === "edit") {
        editUser(id);
      } else if (action === "edit-password") {
        openPasswordModal(id);
      } else if (action === "delete") {
        deleteUser(id);
      }
    });
  }

  // Panggil fungsi fetchUsers saat inisialisasi
  fetchUsers();

  // ======================================================================
  // KONFIGURASI GRUP WA POSTING (via API)
  // ======================================================================
  const formGroupWa = document.getElementById("form-group-wa");
  const groupWaIdInput = document.getElementById("group-wa-id");

  async function loadGroupWaConfig() {
    try {
      const response = await fetch("/api/settings/group-wa-id");
      if (response.ok) {
        const data = await response.json();
        if (groupWaIdInput) groupWaIdInput.value = data.groupWaId || "";
      }
    } catch (error) {
      console.error("Gagal memuat konfigurasi Grup WA:", error);
    }
  }

  loadGroupWaConfig();

  if (formGroupWa) {
    formGroupWa.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newId = groupWaIdInput.value.trim();
      if (newId) {
        try {
          const response = await fetch("/api/settings/group-wa-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupWaId: newId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Gagal menyimpan konfigurasi Grup WA."
            );
          }

          console.log("Group WA Config updated:", newId);
          showNotification(
            "group-wa-notification",
            "Konfigurasi Grup WA berhasil disimpan.",
            "success"
          );
        } catch (error) {
          console.error("Error saat menyimpan konfigurasi Grup WA:", error);
          showNotification(
            "group-wa-notification",
            "Gagal menyimpan konfigurasi. Cek server API.",
            "error"
          );
        }
      } else {
        showNotification(
          "group-wa-notification",
          "ID Grup WA tidak boleh kosong.",
          "error"
        );
      }
    });
  }

  // ======================================================================
  // PENGATURAN RESET PR - TIDAK BERUBAH
  // ======================================================================
  const formResetPr = document.getElementById("form-reset-pr");
  const newPrInput = document.getElementById("new-pr-start-number");
  const prPreview = document.getElementById("pr-preview");
  const currentPrReferenceInput = document.getElementById(
    "current-pr-reference"
  );

  function getRomanMonth(monthIndex) {
    const roman = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    return roman[monthIndex];
  }

  function updatePrPreview() {
    const now = new Date();
    const year = now.getFullYear();
    const month = getRomanMonth(now.getMonth());
    let number = newPrInput && newPrInput.value ? newPrInput.value : "1";

    const paddedNumber = String(number).padStart(3, "0");

    if (prPreview) {
      prPreview.textContent = `${paddedNumber}/PR-SPA/HO/${month}/${year}`;
    }
  }

  const lastUsedPr = "007/PR-SPA/HO/IX/2025";
  if (currentPrReferenceInput) {
    currentPrReferenceInput.value = lastUsedPr;
  }

  updatePrPreview();
  if (newPrInput) {
    newPrInput.addEventListener("input", updatePrPreview);
  }

  if (formResetPr) {
    formResetPr.addEventListener("submit", (e) => {
      e.preventDefault();
      const newStartNumber = newPrInput.value;

      if (
        !newStartNumber ||
        parseInt(newStartNumber) < 1 ||
        parseInt(newStartNumber) > 999
      ) {
        showNotification(
          "settings-notification",
          "Error: Nomor tidak valid. Masukkan angka antara 1-999.",
          "error"
        );
        return;
      }

      if (
        confirm(
          `PERINGATAN: Anda akan mengatur ulang nomor awal PR menjadi ${newStartNumber}. Apakah Anda yakin?`
        )
      ) {
        console.log(
          "Mengirim permintaan ke API untuk mengatur ulang nomor PR ke:",
          newStartNumber
        );

        showNotification(
          "settings-notification",
          `Pengaturan berhasil disimpan. Nomor PR berikutnya akan dimulai dari ${newStartNumber}.`,
          "success"
        );

        newPrInput.value = "";
        updatePrPreview();
      }
    });
  }
});
