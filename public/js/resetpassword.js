const pwEL = document.getElementById("passwordInput")
const pwConfEL = document.getElementById("passwordConfirmInput")
const rpw_btn = document.getElementById("resetPWBTN")
const errorEl = document.getElementById("error")

rpw_btn.addEventListener("click", async function (e) {
    e.preventDefault()
    const pwVal = pwEL.value.trim();
    const pwConfVal = pwConfEL.value.trim();

    if (!pwVal || !pwConfVal) {
        errorEl.style.opacity = 1
        setTimeout(() => {
            errorEl.style.opacity = 0

        }, 5000)
        return
    }

    const res = await axios({
        method: "POST",
        url: "/users/resetpw",
        data: {
            password: pwVal,
            passwordConfirm: pwConfVal
        }

    })

    if (res.data.status.includes("success")) {
        window.setTimeout(() => {
            location.assign("/dashboard")
        }, 1500)

    }

    console.log("auth success", res.data);


})