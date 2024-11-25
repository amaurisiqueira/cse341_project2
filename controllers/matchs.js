const ObjectId = require("mongodb").ObjectId;
const matchData = require("../models/match");
const apiKey = require("../utils/getKey");
const validateMatch = require("../validation/validateMatch");
const { validationResult } = require("express-validator");

const getAll = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    const result = await matchData.getAll();

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

const createMatch = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    await Promise.all(validateMatch.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
      const match = {
        stadium: req.body.stadium,
        team1: req.body.team1,
        team2: req.body.team2,
        team1goals: req.body.team1goals,
        team2goals: req.body.team2goals,
        referee: req.body.referee,
        date: req.body.date,
      };

      const result = await matchData.createSingle(match );

      if (result.acknowledged) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Bad request, invalid input" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    //const result = await matchData.getAll();
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};

const updateMatch = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    await Promise.all(validateMatch.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    try {
        const match = {
            stadium: req.body.stadium,
            team1: req.body.team1,
            team2: req.body.team2,
            team1goals: req.body.team1goals,
            team2goals: req.body.team2goals,
            referee: req.body.referee,
            date: req.body.date,
          };
      const clubId = new ObjectId(req.params.id);
      const result = await matchData.updateSingle(clubId, match);

      if (result.acknowledged) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Bad request, invalid input" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    //const result = await matchData.getAll();
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }
};
const deleteMatch = async (req, res) => {
  if (req.header("apiKey") === apiKey) {
    try {
    
      const clubId = new ObjectId(req.params.id);
      const result = await matchData.deleteSingle(clubId);

      if (result.deletedCount) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Bad request, invalid input" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    //const result = await matchData.getAll();
  } else {
    res.status(401).send("Invalid apiKey, please read the documentation.");
  }


};

module.exports = { getAll, createMatch, updateMatch, deleteMatch };
