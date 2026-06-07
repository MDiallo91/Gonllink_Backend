const router = require("express").Router();
const authUserController = require("../controller/authUserController");
const userController = require("../controller/userController");
const uploadController = require("../controller/uploadController");
const { requireAuth } = require("../midleware/authMidleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", authUserController.signUp);
router.post("/login", authUserController.signIn);
router.post("/logout", userController.logout);
router.put("/upload", upload.single("photo"), uploadController.uploadFile);

router.get("/getUsers", userController.getUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.delete("/:id", requireAuth, userController.deleteUser);

module.exports = router;
