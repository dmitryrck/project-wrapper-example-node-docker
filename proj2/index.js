const express = require("express")
const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("Hello proj22!\n")
})

app.listen(port, () => {
  console.log(`Proj22 listening on port ${port}`)
})
