const mongodb = require("../connections/conection");

const getAll = async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db("w3")
    .collection("footballClubs")
    .find();

  return result;
};

const createSingle = async (club) => {
  const result = await mongodb
    .getDatabase()
    .db("w3")
    .collection("footballClubs")
    .insertOne(club);

  return result;
};

const updateSingle = async (clubId, club) => {
  return (result = await mongodb
    .getDatabase()
    .db("w3")
    .collection("footballClubs")
    .replaceOne({ _id: clubId }, club));
};

const deleteSingle = async (clubId) => {
  return (result = await mongodb
    .getDatabase()
    .db("w3")
    .collection("footballClubs")
    .deleteOne({ _id: clubId }));
};

module.exports = {
  getAll,
  createSingle,
  updateSingle,
  deleteSingle,
};
