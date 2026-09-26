const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");


// ===============================
// HIỆN / ẨN MẬT KHẨU
// ===============================
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        if (password.type === "password") {
            password.type = "text";
            togglePassword.textContent = "◉";
        } else {
            password.type = "password";
            togglePassword.textContent = "◉";
        }
    });
}


// ===============================
// XỬ LÝ ĐĂNG NHẬP
// ===============================
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = username.value.trim();
    const passwordValue = password.value.trim();


    // ===============================
    // KIỂM TRA DỮ LIỆU
    // ===============================
    if (email === "" || passwordValue === "") {

        message.textContent =
            "Vui lòng nhập đầy đủ thông tin.";

        return;
    }


    // ===============================
    // THÔNG BÁO ĐANG ĐĂNG NHẬP
    // ===============================
    message.textContent =
        "Đang đăng nhập...";


    try {

        // ===============================
        // GỌI API ĐĂNG NHẬP
        // ===============================
        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    password: passwordValue
                })
            }
        );


        // ===============================
        // ĐỌC KẾT QUẢ API
        // ===============================
        const result = await response.json();


        console.log("Login response:", result);


        // ===============================
        // ĐĂNG NHẬP THẤT BẠI
        // ===============================
        if (!response.ok || !result.success) {

            message.textContent =
                result.message ||
                "Đăng nhập thất bại.";

            return;
        }


        // ===============================
        // ĐĂNG NHẬP THÀNH CÔNG
        // ===============================
        message.textContent =
            "Đăng nhập thành công!";


        // ===============================
        // LƯU DỮ LIỆU ĐĂNG NHẬP
        // ===============================
        if (result.data) {


            // -------------------------------
            // Lưu thông tin người dùng
            // -------------------------------
            if (result.data.user) {

                const user = result.data.user;


                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(user)
                );


                // -------------------------------
                // Lưu role cho S1-06
                // -------------------------------
                const userRole =
                    (user.role || "USER").toUpperCase();


                localStorage.setItem(
                    "userRole",
                    userRole
                );
            }


            // -------------------------------
            // Lưu Session Token
            // -------------------------------
            if (
                result.data.session &&
                result.data.session.token
            ) {

                localStorage.setItem(
                    "sessionToken",
                    result.data.session.token
                );

                console.log(
                    "Session token đã được lưu."
                );

            } else {

                console.warn(
                    "Không tìm thấy session token trong response."
                );
            }
        }


        // ===============================
        // CHUYỂN SANG GIAO DIỆN S1-06
        // ===============================
        setTimeout(() => {

            window.location.href =
                "components/sidebar.html";

        }, 500);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        message.textContent =
            "Không thể kết nối đến máy chủ.";
    }

});