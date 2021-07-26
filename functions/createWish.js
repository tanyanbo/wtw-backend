const db = require("../firebase/firestore");

const createWish = async (req, res) => {
  try {
    const {
      title,
      price,
      type,
      date,
      taken,
      completed,
      id: userId,
      userNickname,
    } = req.body;
    await db.collection("wishes").add({
      title,
      price,
      type,
      date,
      taken,
      completed,
      user: {
        id: userId,
        nickname: userNickname,
      },
    });

    res.status(201).json({
      status: "Success",
      data: {
        title,
        price,
        type,
        date,
        taken,
        completed,
        user: {
          id: userId,
          nickname: userNickname,
        },
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "Fail",
      message: "Failed to add wish",
    });
  }
};

module.exports = createWish;
