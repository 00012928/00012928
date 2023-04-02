const { Router } = require("express");
const fs = require("fs");

const router = new Router();

// This function deletes the drug as well as removing the image of the drug from uploads file
router.get("/:id/delete", (req, res) => {
    const id = req.params.id;
    fs.readFile("./data/drugs.json", (err, drugs) => {
        if (err) throw err;
        const allDrugs = JSON.parse(drugs);
        const remainDrugs = allDrugs.filter((drug) => drug.id != id);
        const newDrugs = JSON.stringify(remainDrugs);
        const deletedDrug = allDrugs.find((drug) => drug.id == id);
        fs.writeFile("./data/drugs.json", newDrugs, (err) => {
            if (err) throw err;
            if (deletedDrug?.image) {
                fs.unlink(`public/uploads/${deletedDrug?.image}`, (err) => {
                    if (err) throw err;
                });
            }
            res.render("drugs", { drugs: remainDrugs, delete: true });
        });
    });
});

module.exports = router;
