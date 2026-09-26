document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('user-table-body');
    const alertBox = document.getElementById('alert-message');

    // Endpoint theo thông tin của Huy cung cấp
    const API_BASE_URL = 'http://localhost:8080/api/users';

    function showAlert(message, type = 'success') {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        setTimeout(() => {
            alertBox.className = 'alert hidden';
        }, 3000);
    }

    // 1. Gọi API lấy danh sách tài khoản thật
    async function fetchUsers() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Không thể tải danh sách tài khoản');
            
            const result = await response.json();
            
            // Xử lý theo cấu trúc JSON: result.data.users
            const users = result.data && result.data.users ? result.data.users : [];
            renderUsers(users);
        } catch (error) {
            console.error('Lỗi fetchUsers:', error);
            showAlert('Lỗi khi tải danh sách tài khoản từ hệ thống!', 'error');
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">Không thể tải dữ liệu từ Backend</td></tr>`;
        }
    }

    // 2. Render danh sách tài khoản ra bảng
    function renderUsers(users) {
        tableBody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Không có dữ liệu tài khoản</td></tr>`;
            return;
        }

        users.forEach(user => {
            // Theo Huy: status nhận giá trị 'active', 'locked', hoặc 'inactive'
            const isLocked = user.status === 'locked'; 
            const statusText = isLocked ? 'Đã khóa' : 'Đang hoạt động';
            const statusClass = isLocked ? 'status locked' : 'status active';

            const tr = document.createElement('tr');
            // Dùng _id chuẩn MongoDB theo thông tin backend
            tr.setAttribute('data-id', user._id); 

            tr.innerHTML = `
                <td class="username">${user.fullName || 'Không có tên'}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-lock ${isLocked ? 'hidden' : ''}">Khóa</button>
                    <button class="btn btn-unlock ${isLocked ? '' : 'hidden'}">Mở khóa</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // 3. Xử lý sự kiện click Khóa / Mở khóa gọi API Backend
    tableBody.addEventListener('click', async function (e) {
        if (e.target.classList.contains('btn-lock') || e.target.classList.contains('btn-unlock')) {
            const row = e.target.closest('tr');
            const userId = row.getAttribute('data-id');
            const username = row.querySelector('.username').textContent;
            const isLocking = e.target.classList.contains('btn-lock');
            
            const actionText = isLocking ? 'khóa' : 'mở khóa';
            
            // Xác nhận trước khi thao tác
            if (confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${username}" không?`)) {
                try {
                    // Gọi API PUT /api/users/:id với body { "status": "locked" } hoặc "active"
                    const response = await fetch(`${API_BASE_URL}/${userId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: isLocking ? 'locked' : 'active'
                        })
                    });

                    // Nếu API trả về lỗi hoặc thất bại
                    if (!response.ok) {
                        throw new Error(`Backend trả về lỗi mã ${response.status}`);
                    }

                    // CHỈ KHI API THÀNH CÔNG MỚI ĐỔI GIAO DIỆN
                    const statusSpan = row.querySelector('.status');
                    if (isLocking) {
                        statusSpan.textContent = 'Đã khóa';
                        statusSpan.className = 'status locked';
                        row.querySelector('.btn-lock').classList.add('hidden');
                        row.querySelector('.btn-unlock').classList.remove('hidden');
                        showAlert(`Đã khóa thành công tài khoản: ${username}`);
                    } else {
                        statusSpan.textContent = 'Đang hoạt động';
                        statusSpan.className = 'status active';
                        row.querySelector('.btn-unlock').classList.add('hidden');
                        row.querySelector('.btn-lock').classList.remove('hidden');
                        showAlert(`Đã mở khóa thành công tài khoản: ${username}`);
                    }

                } catch (error) {
                    // NẾU API LỖI: Giữ nguyên trạng thái cũ, không đổi giao diện và báo lỗi
                    console.error(`Lỗi khi ${actionText} tài khoản:`, error);
                    showAlert(`Thất bại! Không thể ${actionText} tài khoản ${username}.`, 'error');
                }
            }
        }
    });

    // Gọi hàm fetchUsers khi trang vừa được load xong
    fetchUsers();
});