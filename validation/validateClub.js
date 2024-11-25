const { body, validationResult } = require("express-validator");

const validateClub = [
  body("name")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("country")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("city")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("stadium")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("capacity").isNumeric(),
  body("foundedYear").isNumeric(),
  body("coach")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
];

module.exports = validateClub;
