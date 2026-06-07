const router = require("express").Router();
const secteurController = require("../controller/secteurController")

// Routes
router.get('/public', secteurController.getSecteursPublic); // sans auth — page d'accueil
router.post('/register', secteurController.addSecteur);
router.get('/getSecteurs', secteurController.getSecteur);
router.get('/:id', secteurController.secteurById);
router.put('/:id', secteurController.updateSecteur);
router.delete('/:id', secteurController.deleteSecteur);

module.exports = router;