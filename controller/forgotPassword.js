const for_password = require("../model/forgotpassword");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const Users = require("../model/user");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log('email>>>',email);
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      const id = uuid.v4();
      await for_password
        .create({
          id: id,
          active: true,
          userId: user.id,
        })
        .then(() => {
          console.log("data entered in reset password table successfully");
        })
        .catch((err) => {
          throw new Error(err);
        });
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email, // Change to your recipient
        from: "abhi.breezer10@gmail.com", // Change to your verified sender
        subject: "Recover Your Password",
        text: "Click the link, to regenrate your password:",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      };
      sgMail
        .send(msg)
        .then((response) => {
          return res
            .status(response[0].statusCode)
            .json({
              message: "Check your registerd mail to reset your password",
              res: response,
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else {
      throw new Error("User not registered");
    }
  } catch (err) {
    console.log(err);
  }
};

const checkUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await for_password.findOne({ where: { id: id } });
    if (data.active === true) {
      data.update({ active: false });
      res.send(
        `<html>
      <form action="/password/update-password/${id}" method="GET">
      
          <label for="Password-Input"> New Password </label>
          <input type="password" name="password" >
      
          <button type="submit"> Reset Password </button>
      </form>
      </html>`
      );
    } else {
      throw new Error("Generate reset password link");
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

const setNewPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const password = req.query.password;
    const data = await for_password.findOne({ where: { id } });
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    await Users.update({ password: hash }, { where: { id: data.userId } });
    res.send(
      `<html>
        <h1> Success </h1> 
      </html>`
    );
  } catch (err) {
    res.status(401).send(`<html>
    <h1> Something went wrong, Please try again! </h1> 
    </html>`);
  }
};

module.exports = {
  forgotPassword,
  checkUser,
  setNewPassword,
};
