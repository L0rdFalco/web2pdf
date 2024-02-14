const inputNameEl = document.getElementById("inputName")
const inputEmailEl = document.getElementById("inputEmail")
const inputPWEl = document.getElementById("inputPW")
const inputPWConfirmEl = document.getElementById("inputPWConfirm")
const signup_btn = document.getElementById("signup_btn")
const errorEl = document.getElementById("error")
const signUpMessagesEl = document.getElementById("signUpMessages")

function showSignUpMessage(message) {

    signUpMessagesEl.textContent = message
    signUpMessagesEl.style.opacity = 1

    setTimeout(() => {
        signUpMessagesEl.style.opacity = 0

    }, 10000);
}


if (signup_btn) signup_btn.addEventListener("click", async function (e) {

    try {
        e.preventDefault();
        const nameVal = inputNameEl.value.trim();
        const emailVal = inputEmailEl.value.trim();
        const passwordVal = inputPWEl.value.trim();
        const passwordConfirmVal = inputPWConfirmEl.value.trim()

        if (!nameVal || !emailVal || !passwordVal || !passwordConfirmVal) {
            errorEl.style.opacity = 1
            setTimeout(() => {
                errorEl.style.opacity = 0

            }, 10000)
            return
        }
        showSignUpMessage("creating new account...")

        const res = await axios({
            method: "POST",
            url: "/users/signup",
            data: {
                name: nameVal,
                email: emailVal,
                password: passwordVal,
                passwordConfirm: passwordConfirmVal

            }
        })

        if (res.data.message.includes("success")) {

            window.setTimeout(() => {
                location.assign("/dashboard")
            }, 1500)

        }

        else {
            showSignUpMessage(res.data.message)

        }
    } catch (error) {
        showSignUpMessage(error.response.data.message)
    }


})
