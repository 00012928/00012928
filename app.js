const express = require("express");
const app = express();
const path = require("path");
const drugs = require("./public/Router/drugs");
const addNewDrugs = require("./public/Router/add_new_drug");
const eachDrug = require("./public/Router/each_drug");
const deleteDrugs = require("./public/Router/delete_drugs");


app.set("view engine", "pug");
app.use("/public", express.static("public"));
app.use("public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const PORT = 4000;

app.use(drugs);
app.use(addNewDrugs)
app.use(eachDrug)
app.use(deleteDrugs)

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server is running on port ${PORT}`);
});
