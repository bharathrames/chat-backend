const { register, login, setAvatar, getAllUsers, logOut, getAllUsersdata } = require("../controllers/userController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.post("/setAvatar/:id", setAvatar);
  router.get("/allusers/:id", getAllUsers);
  router.get("/logout/:id", logOut);

  
  module.exports = router;
