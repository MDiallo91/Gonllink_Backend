const router = require("express").Router();
const authUserController = require("../controller/authUserController");
const userController = require("../controller/userController")

// Routes Auth
router.post('/register', authUserController.signUp);
router.post('/login', authUserController.signIn);
//User
router.put('/:id',userController.updateUser);
router.get('/getUsers',userController.getUsers);

module.exports = router;
