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
                        <button class="btn btn-warning btn-sm" data-user-action="edit" data-id="${user.id
        }">Edit</button>
                        <button class="btn btn-secondary btn-sm" data-user-action="edit-password" data-id="${user.id
        }">Pass</button> 
                        <button class="btn btn-danger btn-sm" data-user-action="delete" data-id="${user.id
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

  // ======================================================================
  // DATABASE MANAGEMENT
  // ======================================================================

  let currentViewTable = null;
  let currentPage = 1;
  let totalPages = 1;

  // Check DB Status
  async function checkDatabaseStatus() {
    const statusIndicator = document.getElementById("db-status-indicator");
    const statusText = document.getElementById("db-status-text");
    const dbInfo = document.getElementById("db-info");

    if (!statusIndicator) return;

    statusIndicator.style.background = "#ffc107"; // Yellow - checking
    statusText.textContent = "Memeriksa koneksi...";

    try {
      const response = await fetch("/api/admin/database/status");
      const data = await response.json();

      if (data.connected) {
        statusIndicator.style.background = "#28a745"; // Green
        statusText.textContent = "Terhubung ke database";
        dbInfo.style.display = "block";
        document.getElementById("db-host").textContent = data.host;
        document.getElementById("db-name").textContent = data.database;
        document.getElementById("db-version").textContent = data.version;
      } else {
        statusIndicator.style.background = "#dc3545"; // Red
        statusText.textContent = "Tidak terhubung: " + (data.error || "Unknown error");
        dbInfo.style.display = "none";
      }
    } catch (error) {
      statusIndicator.style.background = "#dc3545";
      statusText.textContent = "Error: " + error.message;
      dbInfo.style.display = "none";
    }
  }

  // Load Table List
  async function loadTableList() {
    const tableBody = document.getElementById("table-list-body");
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="4">Memuat daftar tabel...</td></tr>';

    try {
      const response = await fetch("/api/admin/database/tables");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal memuat tabel");
      }

      tableBody.innerHTML = "";

      if (data.tables.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Tidak ada tabel ditemukan.</td></tr>';
        return;
      }

      data.tables.forEach(table => {
        const row = document.createElement("tr");
        const sizeKB = table.data_size ? (table.data_size / 1024).toFixed(2) + " KB" : "-";
        row.innerHTML = `
          <td><strong>${table.name}</strong></td>
          <td>${table.row_count || 0}</td>
          <td>${sizeKB}</td>
          <td>
            <button class="btn btn-primary btn-sm" data-table-action="view" data-table="${table.name}">
              <i class="fa-solid fa-eye"></i> Lihat
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Error: ${error.message}</td></tr>`;
    }
  }

  // View Table Data
  async function viewTableData(tableName, page = 1) {
    const viewerCard = document.getElementById("data-viewer-card");
    const currentTableSpan = document.getElementById("current-table-name");
    const tableHead = document.getElementById("data-table-head");
    const tableBody = document.getElementById("data-table-body");

    if (!viewerCard) return;

    currentViewTable = tableName;
    currentPage = page;
    currentTableSpan.textContent = tableName;
    viewerCard.style.display = "block";
    viewerCard.scrollIntoView({ behavior: "smooth" });

    tableBody.innerHTML = '<tr><td>Memuat data...</td></tr>';

    try {
      const response = await fetch(`/api/admin/database/tables/${tableName}?page=${page}&limit=20`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal memuat data");
      }

      // Render header
      if (data.columns && data.columns.length > 0) {
        tableHead.innerHTML = "<tr>" + data.columns.map(col =>
          `<th title="${col.type}">${col.name}${col.key_type === "PRI" ? " 🔑" : ""}</th>`
        ).join("") + "<th>Aksi</th></tr>";
      }

      // Render data
      tableBody.innerHTML = "";

      if (data.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="100%">Tidak ada data.</td></tr>';
      } else {
        data.data.forEach(row => {
          const tr = document.createElement("tr");
          const columns = data.columns.map(col => col.name);

          columns.forEach(col => {
            const td = document.createElement("td");
            let value = row[col];

            // Truncate long values
            if (typeof value === "string" && value.length > 50) {
              value = value.substring(0, 50) + "...";
            }
            // Hide password hash
            if (col.toLowerCase() === "pass" || col.toLowerCase() === "password") {
              value = "••••••••";
            }
            td.textContent = value ?? "-";
            tr.appendChild(td);
          });

          // Add action buttons
          const actionTd = document.createElement("td");
          if (row.id) {
            actionTd.innerHTML = `
              <button class="btn btn-danger btn-sm" data-row-action="delete" data-table="${tableName}" data-id="${row.id}">
                <i class="fa-solid fa-trash"></i>
              </button>
            `;
          }
          tr.appendChild(actionTd);
          tableBody.appendChild(tr);
        });
      }

      // Update pagination
      totalPages = data.pagination.totalPages;
      document.getElementById("page-info").textContent = `Page ${data.pagination.page} of ${totalPages}`;
      document.getElementById("btn-prev-page").disabled = data.pagination.page <= 1;
      document.getElementById("btn-next-page").disabled = data.pagination.page >= totalPages;

    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="100%" style="color: red;">Error: ${error.message}</td></tr>`;
    }
  }

  // Delete Row
  async function deleteTableRow(tableName, id) {
    if (!confirm(`Yakin ingin menghapus data dengan ID ${id} dari tabel ${tableName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/database/tables/${tableName}/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (data.success) {
        showNotification("db-notification", "Data berhasil dihapus.", "success");
        viewTableData(tableName, currentPage);
      } else {
        throw new Error(data.message || "Gagal menghapus");
      }
    } catch (error) {
      showNotification("db-notification", error.message, "error");
    }
  }

  // Load DB Config
  async function loadDatabaseConfig() {
    try {
      const response = await fetch("/api/admin/database/config");
      const data = await response.json();

      if (data.success) {
        document.getElementById("config-host").value = data.config.host;
        document.getElementById("config-port").value = data.config.port;
        document.getElementById("config-user").value = data.config.user;
        document.getElementById("config-database").value = data.config.database;
        document.getElementById("config-password-status").value =
          data.config.usingMySQLUrl ? "Menggunakan MYSQL_URL" :
            (data.config.hasPassword ? "Password tersimpan" : "Tanpa password");
      }
    } catch (error) {
      console.error("Error loading DB config:", error);
    }
  }

  // Event Listeners for Database Management
  const btnRefreshStatus = document.getElementById("btn-refresh-db-status");
  if (btnRefreshStatus) {
    btnRefreshStatus.addEventListener("click", checkDatabaseStatus);
  }

  const tableListBody = document.getElementById("table-list-body");
  if (tableListBody) {
    tableListBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-table-action]");
      if (btn && btn.dataset.tableAction === "view") {
        viewTableData(btn.dataset.table);
      }
    });
  }

  const dataTableBody = document.getElementById("data-table-body");
  if (dataTableBody) {
    dataTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-row-action]");
      if (btn && btn.dataset.rowAction === "delete") {
        deleteTableRow(btn.dataset.table, btn.dataset.id);
      }
    });
  }

  const btnCloseViewer = document.getElementById("btn-close-viewer");
  if (btnCloseViewer) {
    btnCloseViewer.addEventListener("click", () => {
      document.getElementById("data-viewer-card").style.display = "none";
      currentViewTable = null;
    });
  }

  const btnRefreshData = document.getElementById("btn-refresh-data");
  if (btnRefreshData) {
    btnRefreshData.addEventListener("click", () => {
      if (currentViewTable) {
        viewTableData(currentViewTable, currentPage);
      }
    });
  }

  const btnPrevPage = document.getElementById("btn-prev-page");
  if (btnPrevPage) {
    btnPrevPage.addEventListener("click", () => {
      if (currentViewTable && currentPage > 1) {
        viewTableData(currentViewTable, currentPage - 1);
      }
    });
  }

  const btnNextPage = document.getElementById("btn-next-page");
  if (btnNextPage) {
    btnNextPage.addEventListener("click", () => {
      if (currentViewTable && currentPage < totalPages) {
        viewTableData(currentViewTable, currentPage + 1);
      }
    });
  }

  // Initialize Database Section when visible
  const dbNavLink = document.querySelector('[data-target="content-database"]');
  if (dbNavLink) {
    dbNavLink.addEventListener("click", () => {
      checkDatabaseStatus();
      loadTableList();
      loadDatabaseConfig();
    });
  }

  // Also load if database section is already visible on page load
  const dbSection = document.getElementById("content-database");
  if (dbSection && !dbSection.classList.contains("hidden")) {
    checkDatabaseStatus();
    loadTableList();
    loadDatabaseConfig();
  }

  // ======================================================================
  // MASTER VENDOR MANAGEMENT
  // ======================================================================

  let vendors = [];
  const formVendor = document.getElementById("form-vendor");
  const vendorIdInput = document.getElementById("vendor-id");
  const vendorKodeInput = document.getElementById("vendor-kode");
  const vendorNamaInput = document.getElementById("vendor-nama");
  const vendorPicInput = document.getElementById("vendor-pic");
  const vendorNohpInput = document.getElementById("vendor-nohp");
  const vendorAlamatInput = document.getElementById("vendor-alamat");
  const vendorTableBody = document.getElementById("vendor-table-body");
  const vendorFormTitle = document.getElementById("vendor-form-title");
  const btnCancelVendor = document.getElementById("btn-cancel-vendor");
  const btnInitVendors = document.getElementById("btn-init-vendors");

  // Fetch vendors from API
  async function fetchVendors() {
    if (!vendorTableBody) return;

    vendorTableBody.innerHTML = '<tr><td colspan="6">Memuat data vendor...</td></tr>';

    try {
      const response = await fetch("/api/admin/vendors");
      if (!response.ok) {
        throw new Error("Gagal memuat data vendor");
      }
      vendors = await response.json();
      renderVendors();
    } catch (error) {
      console.error("Error loading vendors:", error);
      vendorTableBody.innerHTML = `<tr><td colspan="6" style="color: red;">Error: ${error.message}</td></tr>`;
    }
  }

  // Render vendors table
  function renderVendors() {
    if (!vendorTableBody) return;
    vendorTableBody.innerHTML = "";

    if (vendors.length === 0) {
      vendorTableBody.innerHTML = '<tr><td colspan="6">Belum ada data vendor. Klik "Inisialisasi Data Vendor" untuk mengisi data awal.</td></tr>';
      return;
    }

    vendors.forEach((vendor) => {
      const row = document.createElement("tr");
      const alamatShort = vendor.alamat && vendor.alamat.length > 40
        ? vendor.alamat.substring(0, 40) + "..."
        : vendor.alamat || "-";

      row.innerHTML = `
        <td><strong>${vendor.kode}</strong></td>
        <td>${vendor.nama}</td>
        <td>${vendor.pic || "-"}</td>
        <td>${vendor.no_hp || "-"}</td>
        <td title="${vendor.alamat || ''}">${alamatShort}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-warning btn-sm" data-vendor-action="edit" data-id="${vendor.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-vendor-action="delete" data-id="${vendor.id}">Hapus</button>
          </div>
        </td>
      `;
      vendorTableBody.appendChild(row);
    });
  }

  // Reset vendor form
  function resetVendorForm() {
    if (!formVendor) return;
    formVendor.reset();
    vendorIdInput.value = "";
    if (vendorFormTitle) vendorFormTitle.textContent = "Tambah Vendor Baru";
    if (btnCancelVendor) btnCancelVendor.style.display = "none";
  }

  // Handle form submit
  if (formVendor) {
    formVendor.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = vendorIdInput.value;
      const vendorData = {
        kode: vendorKodeInput.value.trim(),
        nama: vendorNamaInput.value.trim(),
        pic: vendorPicInput.value.trim(),
        no_hp: vendorNohpInput.value.trim(),
        alamat: vendorAlamatInput.value.trim()
      };

      if (!vendorData.kode || !vendorData.nama) {
        showNotification("vendor-notification", "Kode dan Nama Vendor wajib diisi.", "error");
        return;
      }

      let url = "/api/admin/vendors";
      let method = "POST";

      if (id) {
        url = `/api/admin/vendors/${id}`;
        method = "PUT";
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vendorData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal menyimpan vendor");
        }

        const message = id ? "Vendor berhasil diperbarui." : "Vendor berhasil ditambahkan.";
        showNotification("vendor-notification", message, "success");

        await fetchVendors();
        resetVendorForm();
      } catch (error) {
        showNotification("vendor-notification", error.message, "error");
      }
    });
  }

  // Cancel edit
  if (btnCancelVendor) {
    btnCancelVendor.addEventListener("click", resetVendorForm);
  }

  // Edit vendor
  function editVendor(id) {
    const vendor = vendors.find(v => v.id == id);
    if (vendor) {
      vendorIdInput.value = vendor.id;
      vendorKodeInput.value = vendor.kode;
      vendorNamaInput.value = vendor.nama;
      vendorPicInput.value = vendor.pic || "";
      vendorNohpInput.value = vendor.no_hp || "";
      vendorAlamatInput.value = vendor.alamat || "";

      if (vendorFormTitle) vendorFormTitle.textContent = "Edit Vendor";
      if (btnCancelVendor) btnCancelVendor.style.display = "inline-block";
      if (formVendor) formVendor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Delete vendor
  async function deleteVendor(id) {
    if (!confirm("Yakin ingin menghapus vendor ini?")) return;

    try {
      const response = await fetch(`/api/admin/vendors/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus vendor");
      }

      showNotification("vendor-notification", "Vendor berhasil dihapus.", "success");
      await fetchVendors();

      if (vendorIdInput.value == id) {
        resetVendorForm();
      }
    } catch (error) {
      showNotification("vendor-notification", error.message, "error");
    }
  }

  // ======================================================================
  // EXCEL IMPORT FOR VENDORS
  // ======================================================================

  const vendorExcelFile = document.getElementById("vendor-excel-file");
  const btnImportVendors = document.getElementById("btn-import-vendors");
  const importPreview = document.getElementById("import-preview");
  const importPreviewHead = document.getElementById("import-preview-head");
  const importPreviewBody = document.getElementById("import-preview-body");
  const importStatus = document.getElementById("import-status");

  let vendorImportData = [];

  // Handle Download Template (Export existing data)
  const btnDownloadTemplate = document.getElementById("btn-download-template");
  if (btnDownloadTemplate) {
    btnDownloadTemplate.addEventListener("click", async () => {
      if (typeof XLSX === "undefined") {
        alert("Library XLSX tidak tersedia. Refresh halaman.");
        return;
      }

      try {
        btnDownloadTemplate.disabled = true;
        btnDownloadTemplate.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunduh...';

        // Fetch existing vendors from database
        const response = await fetch("/api/admin/vendors");
        let existingVendors = [];

        if (response.ok) {
          existingVendors = await response.json();
        }

        // Create template data with headers
        const templateData = [
          ["KODE", "MASTER VENDOR", "PIC", "NO HP/TELP", "ALAMAT"]
        ];

        // Add existing data
        existingVendors.forEach(v => {
          templateData.push([
            v.kode || "",
            v.nama || "",
            v.pic || "",
            v.no_hp || "",
            v.alamat || ""
          ]);
        });

        // Add empty rows for new entries
        for (let i = 0; i < 10; i++) {
          templateData.push(["", "", "", "", ""]);
        }

        // Create workbook and worksheet
        const ws = XLSX.utils.aoa_to_sheet(templateData);

        // Set column widths
        ws["!cols"] = [
          { wch: 8 },   // KODE
          { wch: 35 },  // MASTER VENDOR
          { wch: 25 },  // PIC
          { wch: 18 },  // NO HP/TELP
          { wch: 50 }   // ALAMAT
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vendors");

        // Download file
        const filename = `data_vendor_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, filename);

        showNotification("vendor-notification", `Data ${existingVendors.length} vendor berhasil diexport ke Excel!`, "success");

      } catch (error) {
        console.error("Error exporting:", error);
        showNotification("vendor-notification", "Gagal mengexport data: " + error.message, "error");
      } finally {
        btnDownloadTemplate.disabled = false;
        btnDownloadTemplate.innerHTML = '<i class="fa-solid fa-download"></i> Download Template Excel';
      }
    });
  }

  // Handle file selection
  if (vendorExcelFile) {
    vendorExcelFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) {
        btnImportVendors.disabled = true;
        importPreview.style.display = "none";
        return;
      }

      // Check if XLSX library is loaded
      if (typeof XLSX === "undefined") {
        importStatus.innerHTML = '<span style="color: red;">Library XLSX tidak tersedia. Refresh halaman.</span>';
        return;
      }

      try {
        importStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membaca file...';

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          throw new Error("File Excel kosong atau tidak memiliki data.");
        }

        // Get headers and normalize them
        const headers = jsonData[0].map(h => String(h).trim().toUpperCase());

        // Map columns - flexible matching
        const kodeIdx = headers.findIndex(h => h.includes("KODE"));
        const namaIdx = headers.findIndex(h => h.includes("VENDOR") || h.includes("NAMA"));
        const picIdx = headers.findIndex(h => h.includes("PIC"));
        const hpIdx = headers.findIndex(h => h.includes("HP") || h.includes("TELP") || h.includes("PHONE"));
        const alamatIdx = headers.findIndex(h => h.includes("ALAMAT") || h.includes("ADDRESS"));

        if (kodeIdx === -1 || namaIdx === -1) {
          throw new Error("Kolom KODE atau NAMA VENDOR tidak ditemukan. Pastikan header Excel sesuai.");
        }

        // Parse data rows
        vendorImportData = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const kode = row[kodeIdx] ? String(row[kodeIdx]).trim() : "";
          const nama = row[namaIdx] ? String(row[namaIdx]).trim() : "";

          if (!kode || !nama) continue; // Skip empty rows

          vendorImportData.push({
            kode: kode,
            nama: nama,
            pic: row[picIdx] ? String(row[picIdx]).trim() : "",
            no_hp: row[hpIdx] ? String(row[hpIdx]).trim() : "",
            alamat: row[alamatIdx] ? String(row[alamatIdx]).trim() : ""
          });
        }

        if (vendorImportData.length === 0) {
          throw new Error("Tidak ada data vendor yang valid ditemukan.");
        }

        // Show preview
        importPreviewHead.innerHTML = "<tr><th>Kode</th><th>Nama</th><th>PIC</th><th>No HP</th></tr>";
        importPreviewBody.innerHTML = "";

        vendorImportData.slice(0, 10).forEach(v => {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${v.kode}</td><td>${v.nama}</td><td>${v.pic || "-"}</td><td>${v.no_hp || "-"}</td>`;
          importPreviewBody.appendChild(tr);
        });

        if (vendorImportData.length > 10) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="4" style="text-align:center; color:#666;">... dan ${vendorImportData.length - 10} data lainnya</td>`;
          importPreviewBody.appendChild(tr);
        }

        importPreview.style.display = "block";
        importStatus.innerHTML = `<span style="color: green;">✓ ${vendorImportData.length} vendor siap diimport.</span>`;
        btnImportVendors.disabled = false;

      } catch (error) {
        console.error("Error parsing Excel:", error);
        importStatus.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        importPreview.style.display = "none";
        btnImportVendors.disabled = true;
        vendorImportData = [];
      }
    });
  }

  // Handle import button (SYNC mode)
  if (btnImportVendors) {
    btnImportVendors.addEventListener("click", async () => {
      if (vendorImportData.length === 0) {
        importStatus.innerHTML = '<span style="color: red;">Tidak ada data untuk diimport.</span>';
        return;
      }

      const currentCount = vendors.length;
      const importCount = vendorImportData.length;

      let confirmMsg = `Sinkronisasi ${importCount} vendor dari Excel ke database?\n\n`;
      confirmMsg += `• Data baru akan DITAMBAHKAN\n`;
      confirmMsg += `• Data yang sudah ada akan DIUPDATE\n`;
      confirmMsg += `• Data yang dihapus dari Excel akan DIHAPUS dari database\n\n`;
      confirmMsg += `Lanjutkan?`;

      if (!confirm(confirmMsg)) {
        return;
      }

      try {
        btnImportVendors.disabled = true;
        btnImportVendors.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sinkronisasi...';
        importStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Proses sinkronisasi...';

        const response = await fetch("/api/admin/vendors/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendors: vendorImportData })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal sinkronisasi");
        }

        let statusMsg = `<span style="color: green;">✓ ${result.message}</span>`;
        importStatus.innerHTML = statusMsg;

        showNotification("vendor-notification", result.message, "success");

        await fetchVendors();

        // Reset file input
        vendorExcelFile.value = "";
        importPreview.style.display = "none";
        vendorImportData = [];

      } catch (error) {
        importStatus.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        showNotification("vendor-notification", error.message, "error");
      } finally {
        btnImportVendors.disabled = true;
        btnImportVendors.innerHTML = '<i class="fa-solid fa-upload"></i> Sinkronkan Data Vendor';
      }
    });
  }

  // Event delegation for vendor table
  if (vendorTableBody) {
    vendorTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-vendor-action]");
      if (!btn) return;

      const action = btn.dataset.vendorAction;
      const id = parseInt(btn.dataset.id);

      if (action === "edit") {
        editVendor(id);
      } else if (action === "delete") {
        deleteVendor(id);
      }
    });
  }

  // Load vendors when section is shown
  const vendorNavLink = document.querySelector('[data-target="content-vendor"]');
  if (vendorNavLink) {
    vendorNavLink.addEventListener("click", fetchVendors);
  }

  // Also load if vendor section is already visible on page load
  const vendorSection = document.getElementById("content-vendor");
  if (vendorSection && !vendorSection.classList.contains("hidden")) {
    fetchVendors();
  }
});
