const express = require("express")
const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("Hello proj1!\n")
})

app.listen(port, () => {
  console.log(`Proj1 listening on port ${port}`)
})
