document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("forgotPasswordForm");

    const emailInput = document.getElementById("email");

    const message =
        document.getElementById("message") ||
        document.getElementById("alertMessage");

    if (!form) {
        console.error(
            "Không tìm thấy forgotPasswordForm."
        );
        return;
    }


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            emailInput?.value.trim();


        // ===============================
        // KIỂM TRA EMAIL
        // ===============================
        if (!email) {

            showMessage(
                "Vui lòng nhập email.",
                "error"
            );

            return;
        }


        // ===============================
        // GỌI API QUÊN MẬT KHẨU
        // ===============================
        const button =
            form.querySelector(
                'button[type="submit"]'
            );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Đang xử lý...";
        }


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/password/forgot",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email
                        })
                    }
                );


            const result =
                await response.json();


            console.log(
                "Forgot password response:",
                result
            );


            if (
                !response.ok ||
                !result.success
            ) {

                showMessage(
                    result.message ||
                    "Không thể gửi yêu cầu đặt lại mật khẩu.",
                    "error"
                );

                return;
            }


            // ===============================
            // THÀNH CÔNG
            // ===============================
            showMessage(
                result.message ||
                "Yêu cầu đặt lại mật khẩu đã được tạo.",
                "success"
            );


            form.reset();


            // Nếu Backend trả token để test
            if (
                result.data &&
                result.data.token
            ) {

                console.log(
                    "Reset token:",
                    result.data.token
                );
            }


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            showMessage(
                "Không thể kết nối đến máy chủ.",
                "error"
            );


        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Gửi yêu cầu";
            }
        }

    });


    // ===============================
    // HIỂN THỊ THÔNG BÁO
    // ===============================
    function showMessage(text, type) {

        if (!message) {
            return;
        }

        message.textContent = text;

        message.className =
            `alert-message ${type}`;
    }

});