// 1. Khai báo danh mục Menu theo yêu cầu đề bài S1-06
const MENU_ITEMS = [
  {
    title: "Trang chủ",
    url: "/home",
    icon: "🏠",
    roles: ["USER", "ADMIN"]
  },
  {
    title: "Thông tin cá nhân",
    url: "/profile",
    icon: "👤",
    roles: ["USER", "ADMIN"]
  },
  {
    title: "Quản lý người dùng",
    url: "/admin/users",
    icon: "👥",
    roles: ["ADMIN"]
  },
  {
    title: "Quản lý tài khoản",
    url: "/admin/accounts",
    icon: "💳",
    roles: ["ADMIN"]
  }
];

// 2. Hàm đọc vai trò (role) từ localStorage
function getCurrentUserRole() {
  return (localStorage.getItem("userRole") || "USER").toUpperCase();
}

// 3. Hàm render danh sách menu dựa theo role
function renderMenu() {
  const currentRole = getCurrentUserRole();
  const menuContainer = document.getElementById("menu-list");
  const roleDisplay = document.getElementById("current-role-display");

  // Cập nhật text vai trò
  if (roleDisplay) {
    roleDisplay.textContent = currentRole;
  }

  if (!menuContainer) return;

  // Lọc các item mà role hiện tại được phép xem
  const allowedMenuItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  // Render ra danh sách thẻ li
  menuContainer.innerHTML = allowedMenuItems
    .map(
      (item) => `
      <li class="menu-item">
        <a href="${item.url}" class="menu-link" onclick="event.preventDefault();">
          <span class="menu-icon">${item.icon}</span>
          <span class="menu-title">${item.title}</span>
        </a>
      </li>
    `
    )
    .join("");
}

// 4. Bật/Tắt sidebar khi dùng điện thoại (Responsive)
function setupMobileSidebarEvents() {
  const sidebar = document.getElementById("app-sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const closeBtn = document.getElementById("sidebar-close");
  const overlay = document.getElementById("sidebar-overlay");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);
}

// 5. Gắn sự kiện cho các nút test vai trò ADMIN / USER
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

// Khởi chạy toàn bộ khi HTML tải xong
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  setupMobileSidebarEvents();
  setupTestButtons();
});