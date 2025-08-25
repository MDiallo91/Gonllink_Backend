const router = require("express").Router();
const enchereRoute = require("../controller/enchereController")

// Routes 
router.post('/register', enchereRoute.addEnchere);
router.get('/getEnchere', enchereRoute.getEnchere);
router.get('/:id', enchereRoute.enchereById);
router.put('/:id', enchereRoute.updateEnchere);
router.delete('/:id', enchereRoute.deleteEnchere);

module.exports = router;
