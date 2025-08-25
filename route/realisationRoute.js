const router = require("express").Router();
const realisationRoute = require("../controller/realisationController")

// Routes 
router.post('/register', realisationRoute.addRealisation);
router.get('/getRealisation', realisationRoute.getRealisation);
router.get('/:id', realisationRoute.realisationById);
router.put('/:id', realisationRoute.updateRealisation);
router.delete('/:id', realisationRoute.deleteRealisation);

module.exports = router;
