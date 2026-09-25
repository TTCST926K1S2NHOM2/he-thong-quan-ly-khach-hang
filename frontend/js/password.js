document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');
    const alertMessage = document.getElementById('alertMessage');
    const toggleButtons = document.querySelectorAll('.toggle-password');

    // 1. Chức năng Bật/Tắt Hiện/Ẩn mật khẩu
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (input.type === 'password') {
                input.type = 'text';
                button.style.color = '#2563eb';
            } else {
                input.type = 'password';
                button.style.color = '#64748b';
            }
        });
    });

    // 2. Xử lý submit & validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        hideAlert();

        // Kiểm tra mật khẩu hiện tại
        if (!currentPassword) {
            showAlert('Vui lòng nhập mật khẩu hiện tại.', 'error');
            return;
        }

        // Kiểm tra định dạng mật khẩu mới (Tối thiểu 8 ký tự, có ít nhất 1 chữ và 1 số)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            showAlert('Mật khẩu mới phải từ 8 ký tự trở lên, bao gồm ít nhất một chữ cái và một chữ số.', 'error');
            return;
        }

        // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
        if (currentPassword === newPassword) {
            showAlert('Mật khẩu mới không được giống với mật khẩu hiện tại.', 'error');
            return;
        }

        // Kiểm tra khớp mật khẩu xác nhận
        if (newPassword !== confirmPassword) {
            showAlert('Mật khẩu xác nhận không trùng khớp.', 'error');
            return;
        }

        // Mô phỏng thành công
        showAlert('Đổi mật khẩu thành công! Các phiên đăng nhập khác đã được thu hồi.', 'success');
        form.reset();
    });

    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert-message ${type}`;
    }

    function hideAlert() {
        alertMessage.textContent = '';
        alertMessage.className = 'alert-message';
    }
});