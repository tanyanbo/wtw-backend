const db = require("../firebase/firestore");

const getWish = async (req, res) => {
  try {
    const wishesQuery = await db.collection("wishes").get();
    const wishes = [];
    wishesQuery.forEach((doc) => {
      const wish = doc.data();
      wish["id"] = doc.id;
      wishes.push(wish);
    });
    res.json({
      status: "Success",
      data: wishes,
    });
  } catch (e) {
    res.status(400).json({
      status: "Fail",
      message: "Failed to get wishes",
    });
  }
};

module.exports = getWish;
