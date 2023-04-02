const { Router } = require("express");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = new Router();

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

//
router.get("/", (req, res) => {
  res.render("home");
});

//
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

//add_new_drug
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

//
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

router.get("/api/v1/drugs", (req, res) => {
  fs.readFile("./data/drugs.json", (err, drugs) => {
    if (err) throw err;
    const allDrugs = JSON.parse(drugs);
    res.json(allDrugs);
  });
});

module.exports = router;
