const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");

// Hiện / ẩn mật khẩu
togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "◉";
    } else {
        password.type = "password";
        togglePassword.textContent = "◉";
    }

});

// Xử lý form đăng nhập
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (username.value.trim() === "" || password.value.trim() === "") {
        message.textContent = "Vui lòng nhập đầy đủ thông tin.";
        return;
    }

    message.textContent = "Thông tin đăng nhập đã được gửi.";
});