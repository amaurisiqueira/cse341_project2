const ObjectId = require("mongodb").ObjectId;
const clubsData = require("../models/footballClub");
const apiKey = require("../utils/getKey");
const validateClub = require("../validation/validateClub");
const { validationResult } = require("express-validator");

const getAll = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    const result = await clubsData.getAll();

    try {
      result.toArray().then((users) => {
        res.setHeader("Content-type", "application/json");
        res.status(200).json(users);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

const createClub = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    await Promise.all(validateClub.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      const club = {
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        stadium: req.body.stadium,
        capacity: req.body.capacity,
        foundedYear: req.body.foundedYear,
        coach: req.body.coach,
      };

      const result = await clubsData.createSingle(club);

      if (result.acknowledged) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Bad request, invalid input" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    //const result = await clubsData.getAll();
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

const updateClub = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    await Promise.all(validateClub.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      const club = {
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        stadium: req.body.stadium,
        capacity: req.body.capacity,
        foundedYear: req.body.foundedYear,
        coach: req.body.coach,
      };
      const clubId = new ObjectId(req.params.id);
      const result = await clubsData.updateSingle(clubId, club);

      if (result.acknowledged) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Bad request, invalid input" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    //const result = await clubsData.getAll();
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};
const deleteClub = async (req, res) => {};

module.exports = { getAll, createClub, updateClub, deleteClub };
