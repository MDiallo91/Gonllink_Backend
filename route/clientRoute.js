const router = require("express").Router();
const clientRoute = require("../controller/clientController")

// Routes 
router.post('/register', clientRoute.addClient);
router.get('/getClients', clientRoute.getClient);
router.get('/:id', clientRoute.clientInfo);
router.put('/:id', clientRoute.aupdateclient);
router.delete('/:id', clientRoute.deleteClient);

module.exports = router;
