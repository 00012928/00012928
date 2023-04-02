const { Router } = require("express");
const fs = require("fs");

const router = new Router();

// This code shows the drug that has been selected from each drug pug file
router.get("/drugs/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("./data/drugs.json", (err, drugs) => {
        if (err) throw err;
        const allDrugs = JSON.parse(drugs);
        const eachDrug = allDrugs.find((drug) => drug.id == id);
        res.render("each_drug", {
            drug: eachDrug,
        });
    });
});

module.exports = router;