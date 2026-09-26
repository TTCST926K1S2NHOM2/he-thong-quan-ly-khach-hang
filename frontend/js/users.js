document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('user-table-body');
    const alertBox = document.getElementById('alert-message');

    function showAlert(message, type = 'success') {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        setTimeout(() => {
            alertBox.className = 'alert hidden';
        }, 3000);
    }

    // 1. Hàm gọi API lấy danh sách tài khoản thật từ Backend (nếu cần)
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:8080/api/users'); // Thay URL API thật của Backend vào đây
            const data = await response.json();
            // Render dữ liệu ra bảng ở đây...
        } catch (error) {
            console.error('Lỗi khi tải danh sách tài khoản:', error);
        }
    }

    // 2. Xử lý sự kiện Khóa / Mở khóa gọi API Backend
    tableBody.addEventListener('click', async function (e) {
        if (e.target.classList.contains('btn-lock') || e.target.classList.contains('btn-unlock')) {
            const row = e.target.closest('tr');
            const userId = row.getAttribute('data-id'); // Lấy ID thật của user
            const username = row.querySelector('.username').textContent;
            const isLocking = e.target.classList.contains('btn-lock');
            
            const actionText = isLocking ? 'khóa' : 'mở khóa';
            
            // Xác nhận trước khi thao tác
            if (confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${username}" không?`)) {
                try {
                    // Gọi API Backend (Ví dụ phương thức PUT/PATCH)
                    /* 
                    const response = await fetch(`http://localhost:8080/api/users/${userId}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: isLocking ? 'LOCKED' : 'ACTIVE' })
                    });
                    if (!response.ok) throw new Error('Thất bại');
                    */

                    // Cập nhật giao diện sau khi gọi API thành công
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
                    showAlert(`Lỗi khi ${actionText} tài khoản!`, 'error');
                }
            }
        }
    });

    // Gọi hàm load dữ liệu nếu cần
    // fetchUsers();
});