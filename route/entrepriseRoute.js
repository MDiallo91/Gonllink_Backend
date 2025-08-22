const router = require("express").Router()
const entrepriseController = require("../controller/entrepriseController")


//entreprise
router.post('/register',entrepriseController.addEntreprise);
router.put('/:id',entrepriseController.updateEntreprise);
router.get('/getEntreprise',entrepriseController.getEntreprise);
router.get('/:id', entrepriseController.entrepriseById);
router.delete('/:id', entrepriseController.deleteEntreprise);

module.exports = router;