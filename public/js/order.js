const element = document.getElementById('right-col');
const url = window.location.href.toString()


paypal.Buttons({

    createOrder: async (data, actions) => {


        try {


            const res1 = await fetch(`/purchases/`, {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    productName: url.split("/")[4]
                })
            })

            const res2 = await res1.json()

            return res2.data.id

        } catch (error) {

            console.log(error);
        }

    },

    onApprove: async (data, actions) => {
        try {

            const res1 = await fetch(`/purchases/${data.orderID}/capture/`,
                {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        productName: url.split("/")[4]
                    })
                })

            const res2 = await res1.json()


            if (res2.message.includes("success")) {
                element.innerHTML = '<h3>Thank you for your payment!</h3>';

                setTimeout(() => {
                    window.location.href = `/dashboard/`;

                }, 5000)
            }

            else {
                element.innerHTML = '<h3>Something went wrong. Try again later!</h3>';

            }


        } catch (error) {
            console.log(error);
            element.innerHTML = '<h3>Something went wrong with the payment!</h3>';

        }
    }

}).render("#paypal-button-container")