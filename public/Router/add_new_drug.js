const { Router } = require("express");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const router = new Router();

// This function saves the images that have been uploaded to the uploads folder in public folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// The following lines are the configuration of the uploaded images
let upload = multer({
    limits: {
        fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a valid image file"));
        }

        cb(undefined, true);
    },
    storage: storage,
});

// The below function renders add new drug pug file and fetches the data of the drug when the user clicks on edit button of the drugs
router.get("/add_new_drug", (req, res) => {
    const id = req.query.id;
    if (id) {
        fs.readFile("./data/drugs.json", (err, drugs) => {
            if (err) throw err;
            const allDrugs = JSON.parse(drugs);
            const editedDrugs = allDrugs.find((drug) => drug.id == id);
            res.render("add_new_drug", {
                med_name: editedDrugs.med_name,
                real_price: editedDrugs.real_price,
                discount: editedDrugs.discount,
                about_med: editedDrugs.about_med,
                id,
            });
        });
    } else {
        res.render("add_new_drug");
    }
});

// This code adds new drug and if the edit button is clicked, it edits the drug
router.post("/add_new_drug", upload.single("image"), (req, res) => {
    const id = req.query.id;
    const { med_name, real_price, discount, about_med } = req.body;
    const med_image = req?.file?.filename || "";
    if (med_name && real_price && about_med) {
        if (discount < 0 || discount > 100) {
            res.render("add_new_drug", {
                med_name,
                real_price,
                discount,
                about_med,
                discountOver: true,
                id,
            });
        } else {
            if (real_price > 0) {
                fs.readFile("./data/drugs.json", (err, drugs) => {
                    if (err) throw err;
                    const allDrugs = JSON.parse(drugs);
                    const singleDrug = allDrugs.find((drug) => drug.id == id);
                    const discounted_price = (
                        real_price -
                        (real_price / 100) * discount
                    ).toFixed(2);
                    allDrugs.unshift({
                        id: crypto.randomUUID(),
                        med_name,
                        real_price,
                        discounted_price,
                        discount,
                        about_med,
                        image: med_image ? med_image : singleDrug?.image,
                    });
                    let newDrugs;
                    if (id) {
                        const remainDrugs = allDrugs.filter((drug) => drug.id != id);
                        newDrugs = JSON.stringify(remainDrugs);
                    } else {
                        newDrugs = JSON.stringify(allDrugs);
                    }
                    fs.writeFile("./data/drugs.json", newDrugs, (err) => {
                        if (err) throw err;
                        res.render("add_new_drug", { added: true, id });
                    });
                });
            } else {
                res.render("add_new_drug", {
                    med_name,
                    real_price,
                    discount,
                    about_med,
                    id,
                    real_price_minus: true,
                });
            }
        }
    } else {
        res.render("add_new_drug", {
            med_name,
            real_price,
            discount,
            about_med,
            id,
        });
    }
});

module.exports = router;