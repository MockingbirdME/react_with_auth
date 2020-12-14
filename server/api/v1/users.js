const express = require("express");
const createError = require("http-errors");

const router = express.Router();

router.get("/me", whoAmI);


function whoAmI(req, res, next) {
  const {user} = req;

  // TODO throw a big ol' error if we don't have a user.
  if (!user) next(createError(401));
  res.json(user);
}

module.exports = router;
