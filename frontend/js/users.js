document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('user-table-body');
    const alertBox = document.getElementById('alert-message');

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.className = 'alert success';
        setTimeout(() => {
            alertBox.className = 'alert hidden';
        }, 3000);
    }

    tableBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-lock')) {
            const row = e.target.closest('tr');
            const username = row.querySelector('.username').textContent;
            
            // Xác nhận trước khi khóa
            if (confirm(`Bạn có chắc chắn muốn khóa tài khoản "${username}" không?`)) {
                const statusSpan = row.querySelector('.status');
                statusSpan.textContent = 'Đã khóa';
                statusSpan.className = 'status locked';

                row.querySelector('.btn-lock').classList.add('hidden');
                row.querySelector('.btn-unlock').classList.remove('hidden');

                showAlert(`Đã khóa thành công tài khoản: ${username}`);
            }
        }

        if (e.target.classList.contains('btn-unlock')) {
            const row = e.target.closest('tr');
            const username = row.querySelector('.username').textContent;
            
            // Xác nhận trước khi mở khóa
            if (confirm(`Bạn có chắc chắn muốn mở khóa tài khoản "${username}" không?`)) {
                const statusSpan = row.querySelector('.status');
                statusSpan.textContent = 'Đang hoạt động';
                statusSpan.className = 'status active';

                row.querySelector('.btn-unlock').classList.add('hidden');
                row.querySelector('.btn-lock').classList.remove('hidden');

                showAlert(`Đã mở khóa thành công tài khoản: ${username}`);
            }
        }
    });
});