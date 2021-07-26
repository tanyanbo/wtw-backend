const getInfo = async (req, res) => {
  res.json({
    status: "Success",
    data: {
      nickname: req.body.userNickname,
      coins: req.body.coins,
    },
  });
};

module.exports = getInfo;
