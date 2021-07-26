const db = require("../firebase/firestore");

const updateWish = async (req, res) => {
  try {
    const { wishId, ...params } = req.body;
    await db
      .collection("wishes")
      .doc(wishId)
      .update({ ...params, takenBy: req.body.id });

    res.json({
      status: "Success",
      data: { ...req.body },
    });
  } catch (e) {
    res.status(400).json({
      status: "Fail",
      message: "Failed to update wish",
    });
  }
};

module.exports = updateWish;
