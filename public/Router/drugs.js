const { Router } = require("express");
const fs = require("fs");

const router = new Router();

router.get("/", (req, res) => {
  res.render("home");
});

// The below function takes all drugs and show it in drugs page
router.get("/drugs", (req, res) => {
  const { search, select } = req.query;
  fs.readFile("./data/drugs.json", (err, drugs) => {
    if (err) throw err;
    const allDrugs = JSON.parse(drugs);

    const searchedDrugs = allDrugs.filter((drug) => {
      if (select == "non_discount") {
        if (search) {
          return (
            drug.med_name.toLowerCase().includes(search) && drug.discount == ""
          );
        } else {
          return drug.discount == "";
        }
      } else if (select == "discount") {
        if (search) {
          return drug.med_name.toLowerCase().includes(search) && drug.discount;
        } else {
          return drug.discount;
        }
      } else {
        return drug.med_name.toLowerCase().includes(search);
      }
    });

    if (search || select) {
      res.render("drugs", { drugs: searchedDrugs, search });
    } else {
      res.render("drugs", { drugs: allDrugs });
    }
  });
});

// The following shows all drugs in json format
router.get("/api/v1/drugs", (req, res) => {
  fs.readFile("./data/drugs.json", (err, drugs) => {
    if (err) throw err;
    const allDrugs = JSON.parse(drugs);
    res.json(allDrugs);
  });
});

module.exports = router;
