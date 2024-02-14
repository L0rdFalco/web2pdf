//modal login
const auth_email_El = document.getElementById("auth_email")
const auth_password_El = document.getElementById("auth_password")
const auth_login_El = document.getElementById("auth_login")
const errorEl = document.getElementById("error")
const signInMessagesEl = document.getElementById("signInMessages")

function showSignInMessage(message) {

    signInMessagesEl.textContent = message

    signInMessagesEl.style.opacity = 1
    setTimeout(() => {
        signInMessagesEl.style.opacity = 0

    }, 10000);
}

if (auth_login_El) auth_login_El.addEventListener("click", async function (e) {
    e.preventDefault()
    const auth_emailVal = auth_email_El.value.trim();
    const auth_passwordVal = auth_password_El.value.trim();

    try {
        if (!auth_emailVal || !auth_passwordVal) {
            errorEl.style.opacity = 1
            setTimeout(() => {
                errorEl.style.opacity = 0

            }, 10000)
            return
        }
        showSignInMessage("signing you in ... ")

        const res1 = await fetch("/users/login", {
            method: "POST",
            body: JSON.stringify({
                email: auth_emailVal,
                password: auth_passwordVal
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }

        })

        const res2 = await res1.json();

        if (res2.message === "login success") {

            window.location.href = `/dashboard/`

        }
        else {
            showSignInMessage(res2.message)

        }

    } catch (error) {
        showSignInMessage(error.response.data.message)

    }

})


