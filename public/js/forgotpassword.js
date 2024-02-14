const emailEL = document.getElementById("emailEl")
const fpw_btn = document.getElementById("fpwBtn")
const errorEl = document.getElementById("error")

fpw_btn.addEventListener("click", async function (e) {
    e.preventDefault()

    try {
        const emailVal = emailEL.value.trim();

        if (!emailVal) {
            errorEl.style.opacity = 1
            setTimeout(() => {
                errorEl.style.opacity = 0

            }, 5000)
            return
        }

        const res = await axios({
            method: "POST",
            url: "/users/forgotpw",
            data: {
                email: emailVal,
            }

        })

        if (res.data.status.includes("success")) {
            window.setTimeout(() => {
                location.assign("/dashboard")
            }, 1500)

        }

        console.log("auth success", res.data);
    } catch (error) {
        console.log(error);

    }



})