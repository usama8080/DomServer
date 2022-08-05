require("dotenv");
const db = require("../../../models");
const crypto = require("crypto");
const config = require("../../config");
const nodemailer = require("nodemailer");
var smtpPool = require("nodemailer-smtp-pool");
const bcrypt = require("bcrypt");
const { nextTick } = require("process");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API);

const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.VerifiedEmail,
}) => {
  try {
    const sendemail = {
      to,
      from,
      subject,
      html,
    };
    const fina = await sgMail.send(sendemail);
    console.log("final ha ya ,:", fina[0].statusCode);
    return fina[0].statusCode;
  } catch (error) {
    next(error);
  }
};

async function sendVerificationEmail(account, host) {
  let message;

  const verifyUrl = `${host}/api/user/verify?token=${account.verificationToken}`;
  console.log("email hit2 ", verifyUrl);
  message = `<p>Please click the below link to verify your email address:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;

  let sendemail = await sendEmail({
    to: account.email,
    subject: "Sign-up Verification API - Verify Email",
    html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`,
  });
  if (sendemail == 202) {
    return true;
  } else {
    return false;
  }
  //console.log("retirn link: ", verificationLink);
  //return verificationLink;
}

async function verifyEmail(token) {
  // console.log("fucntion ma token :", token);
  try {
    const account = await db.User.findOne({
      where: { verificationToken: token },
    });

    if (!account) throw "Verification failed";

    account.verificationToken = null;
    account.emailVerified = true;
    await account.save();
    return true;
  } catch (err) {
    return err;
  }
}
async function resetPassword({ email, password }) {
  // const account = await validateResetToken({ token });
  const account = await db.User.findOne({ where: { email } });
  if (account.verifyEmailForgetPassword) {
    account.password = await bcrypt.hash(password, 10);
    // account.passwordReset = Date.now();
    // account.resetToken = null;

    const update = await db.User.update(
      {
        password: account.password,
        verifyEmailForgetPassword: false,
        // passwordReset: account.passwordReset,
        // resetToken: null,
      },
      {
        where: { id: account.id },
      }
    );
  } else {
    throw "Password reset already";
  }
  // update password and remove reset token
}
const sendVerificationEmailForgetPassword = async (email, origin) => {
  console.log("email forget password : : : ", email);
  const randomTokenString = async () => {
    return crypto.randomBytes(40).toString("hex");
  };
  const userExist = await db.User.findOne({ where: { email } });
  // console.log("email forget password : : : ", userExist.email);

  if (userExist) {
    const randomToken = await randomTokenString();
    console.log("one :", randomToken);
    await db.User.update({ resetToken: randomToken }, { where: { email } });
    let message = `${origin}/api/user/forgotpassword?resetToken=${randomToken}`;
    console.log("one");
    await sendEmail({
      to: email,
      subject: "Forget Password Verfication Mail",
      html: `<h4>Verify Email</h4>
               ${message}`,
    });
    return true;
  } else {
    //console.log("two");
    return false;
  }
};
async function resetPassword({ email, password }) {
  // const account = await validateResetToken({ token });
  const account = await db.User.findOne({ where: { email } });
  if (account.verifyEmailForgetPassword) {
    account.password = await bcrypt.hash(password, 10);

    const update = await db.User.update(
      {
        password: account.password,
        verifyEmailForgetPassword: false,
        // passwordReset: account.passwordReset,
        // resetToken: null,
      },
      {
        where: { id: account.id },
      }
    );
  } else {
    throw "Password reset already";
  }
  // update password and remove reset token
}
const verfiyEmailForgetPassword = async (resetToken) => {
  console.log("\n\n\nemail verification forgetPassword", resetToken);
  const checker = await db.User.findOne({ where: { resetToken } });
  // console.log("\n\n\ncheck is here : : : ", !checker.verifyEmailForgetPassword);
  if (checker && !checker.verifyEmailForgetPassword) {
    // console.log("one");
    await db.User.update(
      { verifyEmailForgetPassword: true },
      { where: { resetToken } }
    );
    return true;
  } else {
    // console.log("two");

    return false;
  }
};

async function SendGrid(account) {}
module.exports = {
  sendVerificationEmail,
  verifyEmail,
  sendVerificationEmailForgetPassword,
  resetPassword,
  verfiyEmailForgetPassword,
};
