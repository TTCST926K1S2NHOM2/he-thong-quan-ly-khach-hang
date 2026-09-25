
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


function getCurrentUserRole() {
  return (localStorage.getItem("userRole") || "USER").toUpperCase();
}


function renderMenu() {
  const currentRole = getCurrentUserRole();
  const menuContainer = document.getElementById("menu-list");
  const roleDisplay = document.getElementById("current-role-display");


  if (roleDisplay) {
    roleDisplay.textContent = currentRole;
  }

  if (!menuContainer) return;

 
  const allowedMenuItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );


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


document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  setupMobileSidebarEvents();
  setupTestButtons();
});