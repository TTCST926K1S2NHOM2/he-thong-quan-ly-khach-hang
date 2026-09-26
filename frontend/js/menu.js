const MENU_ITEMS = [
  {
    title: "Trang chủ",
    url: "/home",
    roles: ["USER", "ADMIN"]
  },
  {
    title: "Thông tin cá nhân",
    url: "/profile",
    roles: ["USER", "ADMIN"]
  },
  {
    title: "Quản lý người dùng",
    url: "/admin/users",
    roles: ["ADMIN"]
  },
  {
    title: "Quản lý tài khoản",
    url: "/admin/accounts",
    roles: ["ADMIN"]
  }
];


// ================================
// LẤY ROLE HIỆN TẠI
// ================================
function getCurrentUserRole() {
  const role = localStorage.getItem("userRole");

  if (!role) {
    return "USER";
  }

  return role.toUpperCase();
}


// ================================
// HIỂN THỊ MENU THEO QUYỀN
// ================================
function renderMenu() {
  const currentRole = getCurrentUserRole();

  const menuContainer = document.getElementById("menu-list");
  const roleDisplay = document.getElementById("current-role-display");

  if (roleDisplay) {
    roleDisplay.textContent = currentRole;
  }

  if (!menuContainer) {
    return;
  }

  const allowedMenuItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  menuContainer.innerHTML = allowedMenuItems
    .map(
      (item) => `
        <li class="menu-item">
          <a
            href="${item.url}"
            class="menu-link"
            onclick="handleMenuClick(event, '${item.url}')"
          >
            <span class="menu-title">
              ${item.title}
            </span>
          </a>
        </li>
      `
    )
    .join("");
}


// ================================
// XỬ LÝ CLICK MENU
// ================================
function handleMenuClick(event, url) {
  event.preventDefault();

  console.log("Menu được chọn:", url);
}


// ================================
// SIDEBAR MOBILE
// ================================
function setupMobileSidebarEvents() {
  const sidebar = document.getElementById("app-sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const closeBtn = document.getElementById("sidebar-close");
  const overlay = document.getElementById("sidebar-overlay");

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add("open");
    }

    if (overlay) {
      overlay.classList.add("active");
    }
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("active");
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", openSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }
}


// ================================
// NÚT TEST ADMIN / USER
// ================================
function setupTestButtons() {
  const btnAdmin = document.getElementById("btn-set-admin");
  const btnUser = document.getElementById("btn-set-user");

  if (btnAdmin) {
    btnAdmin.addEventListener("click", () => {
      localStorage.setItem("userRole", "ADMIN");
      renderMenu();
    });
  }

  if (btnUser) {
    btnUser.addEventListener("click", () => {
      localStorage.setItem("userRole", "USER");
      renderMenu();
    });
  }
}


// ================================
// ĐĂNG XUẤT
// ================================
async function logout() {
  const logoutButton = document.getElementById("btn-logout");

  try {

    // -------------------------------
    // Đổi trạng thái nút
    // -------------------------------
    if (logoutButton) {
      logoutButton.disabled = true;
      logoutButton.textContent = "Đang đăng xuất...";
    }


    // -------------------------------
    // LẤY SESSION TOKEN
    // -------------------------------
    const token = localStorage.getItem("sessionToken");

    console.log(
      "Logout token:",
      token ? "ĐÃ CÓ TOKEN" : "KHÔNG CÓ TOKEN"
    );


    // -------------------------------
    // Không có token
    // -------------------------------
    if (!token) {

      alert(
        "Không tìm thấy Session Token.\n" +
        "Vui lòng đăng nhập lại."
      );

      if (logoutButton) {
        logoutButton.disabled = false;
        logoutButton.textContent = "Đăng xuất";
      }

      return;
    }


    // -------------------------------
    // GỌI API LOGOUT
    // -------------------------------
    const response = await fetch(
      "http://localhost:8080/api/sessions/logout",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          // Gửi token cho Backend
          "Authorization": "Bearer " + token
        },

        // Gửi cookie nếu có
        credentials: "include"
      }
    );


    // -------------------------------
    // Đọc response
    // -------------------------------
    const result = await response.json();

    console.log(
      "Logout response:",
      result
    );


    // -------------------------------
    // Logout thất bại
    // -------------------------------
    if (!response.ok || !result.success) {

      alert(
        result.message ||
        "Đăng xuất thất bại."
      );

      if (logoutButton) {
        logoutButton.disabled = false;
        logoutButton.textContent = "Đăng xuất";
      }

      return;
    }


    // ================================
    // LOGOUT THÀNH CÔNG
    // ================================

    // Xóa thông tin user
    localStorage.removeItem("currentUser");

    // Xóa role
    localStorage.removeItem("userRole");

    // Xóa session token
    localStorage.removeItem("sessionToken");


    // -------------------------------
    // Quay về Login
    // -------------------------------
    window.location.href = "../index.html";

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

    alert(
      "Không thể kết nối đến máy chủ.\n" +
      "Hãy kiểm tra Backend có đang chạy không."
    );

    if (logoutButton) {
      logoutButton.disabled = false;
      logoutButton.textContent = "Đăng xuất";
    }
  }
}


// ================================
// GẮN SỰ KIỆN NÚT ĐĂNG XUẤT
// ================================
function setupLogoutButton() {
  const logoutButton =
    document.getElementById("btn-logout");

  if (!logoutButton) {
    console.error(
      "Không tìm thấy nút btn-logout"
    );

    return;
  }

  logoutButton.addEventListener(
    "click",
    logout
  );
}


// ================================
// KHỞI ĐỘNG
// ================================
document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderMenu();

    setupMobileSidebarEvents();

    setupTestButtons();

    setupLogoutButton();

  }
);