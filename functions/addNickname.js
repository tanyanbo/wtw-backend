const db = require("../firebase/firestore");

const addNickname = async (req, res) => {
  try {
    await db
      .collection("users")
      .doc(req.body.id)
      .update({ nickname: req.body.nickname });
    res.json({ status: "Success", message: "Successfully added nickname" });
  } catch (e) {
    res.status(400).json({ status: "Fail", message: "Failed to add nickname" });
  }
};

module.exports = addNickname;
