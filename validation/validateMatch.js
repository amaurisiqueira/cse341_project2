const { body, validationResult } = require("express-validator");

const validateMatch = [
  body("stadium")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("team1")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("team2")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),  
  body("team1goals").isNumeric(),
  body("team2goals").isNumeric(),
  body("referee")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .isLength({ min: 3, max: 30 }),
  body("date").isISO8601(),
      
];

module.exports = validateMatch;
