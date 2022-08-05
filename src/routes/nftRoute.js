const router = require("express").Router();

const {
  nft,
  getDragonByid,
  achievements,
} = require("../controller/nftContoller");
// router.get(
//   "/achievements",
//   achievements
// );

router.post("/", nft);

router.post("/dragon", getDragonByid);

module.exports = router;
