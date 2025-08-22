const router = require("express").Router();
const travailleurController = require("../controller/travailleurController")

// Routes 
router.post('/register', travailleurController.addTravailleur);
router.get('/getTravailleurs', travailleurController.getTravailleurs);
router.get('/:id', travailleurController.travailleurInfo);
router.put('/:id', travailleurController.updateTravailleur);
router.delete('/:id', travailleurController.deleteTravailleur);

module.exports = router;
