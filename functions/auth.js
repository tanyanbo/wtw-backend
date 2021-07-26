const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../firebase/firestore");

const signInOrRegister = async (req, res) => {
  const { phone, code } = req.body;
  console.log(phone, code);
  try {
    const users = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();

    let dbCode;
    let id;

    users.forEach((doc) => {
      id = doc.id;
      dbCode = doc.data().code;
    });

    console.log(`dbCode: ${dbCode}`);

    if (!users.empty) {
      // user exists
      const isMatch = await bcrypt.compare(code, dbCode);

      if (isMatch) {
        // code is correct
        const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
          expiresIn: "7 days",
        });

        await db.collection("users").doc(id).update({ token });

        res.status(200).json({
          status: "success",
          message: `Id of new user: ${id}`,
          accessToken: token,
          isNewUser: false,
          id,
        });
      } else {
        // code is incorrect
        res.status(401).json({
          status: "fail",
          message: "Incorrect phone number or verification code",
        });
      }
    } else {
      // user does not exist
      const hashedCode = await bcrypt.hash(code, 12);

      const newUser = await db.collection("users").add({
        phone,
        code: hashedCode,
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "7 days",
      });

      await newUser.update({ token });

      res.status(200).json({
        status: "success",
        message: `Id of new user: ${newUser.id}`,
        accessToken: token,
        isNewUser: true,
        id: newUser.id,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: "Failed to sign in",
    });
  }
};

module.exports = {
  signInOrRegister,
};
