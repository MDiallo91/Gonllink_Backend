const router = require("express").Router();
const realisationRoute = require("../controller/realisationController")
const multer = require('multer')
const storage = multer.memoryStorage()
const uploade = multer({ storage: storage})
// Routes 

router.post("/register", uploade.array("images", 7), realisationRoute.createRealisation)
router.get('/getRealisation', realisationRoute.getRealisation);
router.get('/realisateur/:id', realisationRoute.getRealisationById);
// router.get('/:id', realisationRoute.realisationById);
// router.put('/:id', realisationRoute.updateRealisation);
// router.delete('/:id', realisationRoute.deleteRealisation);

module.exports = router;
