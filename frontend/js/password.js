document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CÁC FORM
    // ==========================================
    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const resetPasswordForm =
        document.getElementById("resetPasswordForm");

    const changePasswordForm =
        document.getElementById("changePasswordForm");


    // ==========================================
    // HIỆN / ẨN MẬT KHẨU
    // ==========================================
    const toggleButtons =
        document.querySelectorAll(".toggle-password");

    toggleButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-target");

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            if (input.type === "password") {

                input.type = "text";
                button.style.color = "#00e65c";

            } else {

                input.type = "password";
                button.style.color = "#64748b";
            }
        });
    });


    // =====================================================
    // 1. QUÊN MẬT KHẨU
    // =====================================================
    if (forgotPasswordForm) {

        console.log("Trang Quên mật khẩu đã được tải.");

        forgotPasswordForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const emailInput =
                    document.getElementById("email");

                const message =
                    document.getElementById("message");

                const button =
                    forgotPasswordForm.querySelector(
                        'button[type="submit"]'
                    );

                if (!emailInput) {
                    console.error(
                        "Không tìm thấy input email."
                    );
                    return;
                }

                const email =
                    emailInput.value.trim();


                // --------------------------
                // Validate
                // --------------------------
                if (!email) {

                    showMessage(
                        message,
                        "Vui lòng nhập email.",
                        "error"
                    );

                    return;
                }


                try {

                    if (button) {
                        button.disabled = true;
                        button.textContent =
                            "Đang gửi...";
                    }


                    // ==========================
                    // API QUÊN MẬT KHẨU
                    // ==========================
                    const response = await fetch(
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
                            message,
                            result.message ||
                            "Gửi yêu cầu thất bại.",
                            "error"
                        );

                        return;
                    }


                    // ==========================
                    // THÀNH CÔNG
                    // ==========================
                    showMessage(
                        message,
                        result.message ||
                        "Yêu cầu đặt lại mật khẩu đã được tạo.",
                        "success"
                    );


                    /*
                     * Nếu backend trả resetToken
                     * thì lưu để test reset-password.
                     */
                    const resetToken =
                        result.data?.resetToken ||
                        result.resetToken;

                    if (resetToken) {

                        sessionStorage.setItem(
                            "resetToken",
                            resetToken
                        );

                        console.log(
                            "Reset token đã được lưu."
                        );
                    }


                } catch (error) {

                    console.error(
                        "Forgot password error:",
                        error
                    );

                    showMessage(
                        message,
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
            }
        );
    }


    // =====================================================
    // 2. ĐẶT LẠI MẬT KHẨU
    // =====================================================
    if (resetPasswordForm) {

        console.log(
            "Trang Đặt lại mật khẩu đã được tải."
        );

        resetPasswordForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const tokenInput =
                    document.getElementById("token");

                const newPasswordInput =
                    document.getElementById(
                        "newPassword"
                    );

                const confirmPasswordInput =
                    document.getElementById(
                        "confirmPassword"
                    );

                const message =
                    document.getElementById("message");

                const button =
                    resetPasswordForm.querySelector(
                        'button[type="submit"]'
                    );


                // --------------------------
                // Token
                // --------------------------
                let token =
                    tokenInput?.value.trim() || "";

                if (!token) {

                    token =
                        sessionStorage.getItem(
                            "resetToken"
                        ) || "";
                }


                const newPassword =
                    newPasswordInput?.value.trim() || "";

                const confirmPassword =
                    confirmPasswordInput?.value.trim() || "";


                if (!token) {

                    showMessage(
                        message,
                        "Vui lòng nhập Token đặt lại mật khẩu.",
                        "error"
                    );

                    return;
                }


                // --------------------------
                // Validate password
                // --------------------------
                const passwordRegex =
                    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;


                if (
                    !passwordRegex.test(
                        newPassword
                    )
                ) {

                    showMessage(
                        message,
                        "Mật khẩu mới phải từ 8 ký tự trở lên, có ít nhất một chữ cái và một chữ số.",
                        "error"
                    );

                    return;
                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showMessage(
                        message,
                        "Mật khẩu xác nhận không trùng khớp.",
                        "error"
                    );

                    return;
                }


                try {

                    if (button) {
                        button.disabled = true;
                        button.textContent =
                            "Đang đặt lại...";
                    }


                    // ==========================
                    // API RESET PASSWORD
                    // ==========================
                    const response = await fetch(
                        "http://localhost:8080/api/password/reset",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                token: token,
                                newPassword: newPassword
                            })
                        }
                    );


                    const result =
                        await response.json();


                    console.log(
                        "Reset password response:",
                        result
                    );


                    if (
                        !response.ok ||
                        !result.success
                    ) {

                        showMessage(
                            message,
                            result.message ||
                            "Đặt lại mật khẩu thất bại.",
                            "error"
                        );

                        return;
                    }


                    // ==========================
                    // THÀNH CÔNG
                    // ==========================
                    showMessage(
                        message,
                        result.message ||
                        "Đặt lại mật khẩu thành công.",
                        "success"
                    );


                    sessionStorage.removeItem(
                        "resetToken"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "../index.html";

                    }, 1200);


                } catch (error) {

                    console.error(
                        "Reset password error:",
                        error
                    );

                    showMessage(
                        message,
                        "Không thể kết nối đến máy chủ.",
                        "error"
                    );

                } finally {

                    if (button) {
                        button.disabled = false;
                        button.textContent =
                            "Đặt lại mật khẩu";
                    }
                }
            }
        );
    }


    // =====================================================
    // 3. ĐỔI MẬT KHẨU
    // =====================================================
    if (changePasswordForm) {

        console.log(
            "Trang Đổi mật khẩu đã được tải."
        );

        changePasswordForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const currentPassword =
                    document
                        .getElementById(
                            "currentPassword"
                        )
                        ?.value.trim() || "";


                const newPassword =
                    document
                        .getElementById(
                            "newPassword"
                        )
                        ?.value.trim() || "";


                const confirmPassword =
                    document
                        .getElementById(
                            "confirmPassword"
                        )
                        ?.value.trim() || "";


                const alertMessage =
                    document.getElementById(
                        "alertMessage"
                    );


                // --------------------------
                // Validate
                // --------------------------
                if (!currentPassword) {

                    showMessage(
                        alertMessage,
                        "Vui lòng nhập mật khẩu hiện tại.",
                        "error"
                    );

                    return;
                }


                const passwordRegex =
                    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;


                if (
                    !passwordRegex.test(
                        newPassword
                    )
                ) {

                    showMessage(
                        alertMessage,
                        "Mật khẩu mới phải từ 8 ký tự trở lên, bao gồm ít nhất một chữ cái và một chữ số.",
                        "error"
                    );

                    return;
                }


                if (
                    currentPassword ===
                    newPassword
                ) {

                    showMessage(
                        alertMessage,
                        "Mật khẩu mới không được giống mật khẩu hiện tại.",
                        "error"
                    );

                    return;
                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showMessage(
                        alertMessage,
                        "Mật khẩu xác nhận không trùng khớp.",
                        "error"
                    );

                    return;
                }


                /*
                 * Hiện tại giữ nguyên hành vi
                 * của S1-04 mà thành viên đã làm.
                 */
                showMessage(
                    alertMessage,
                    "Đổi mật khẩu thành công! Các phiên đăng nhập khác đã được thu hồi.",
                    "success"
                );


                changePasswordForm.reset();
            }
        );
    }


    // =====================================================
    // HÀM HIỂN THỊ THÔNG BÁO
    // =====================================================
    function showMessage(
        element,
        text,
        type
    ) {

        if (!element) {
            return;
        }

        element.textContent = text;


        if (type === "success") {

            element.style.color =
                "#00b84a";

        } else {

            element.style.color =
                "#dc2626";
        }
    }

});