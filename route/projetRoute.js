const router = require("express").Router();
const projetController = require("../controller/projetController")

// Routes 
router.post('/register', projetController.addProjet);
router.get('/getProjets', projetController.getprojets);
router.get('/:id', projetController.projetInfo);
router.put('/:id', projetController.updateProjet);
router.delete('/:id', projetController.deleteProjet);

module.exports = router;
