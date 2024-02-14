const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
let connected = false

function init() {

    do {
        try {

            const app = require("./app.js")


            mongoose.connect(process.env.MONGO_CONN_STR).then(() => {
                console.log("autobot db connected");
            })

            const port = process.env.PORT || 5000

            app.listen(port, () => {
                console.log(`autobot app listening on port ${port}`);
            })

            connected = true;

        } catch (error) {
            console.log(error);
        }
    }
    while (!connected)


}


init()
