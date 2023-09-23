const verify = require("../models/emailVerification");
const { hashFunction, createJwt } = require("./function");
const nodemailer = require("nodemailer");
const uuid4 = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const { google } = require("googleapis");
const password = require("../models/password_reset");
// These id's and secrets should come from .env file.
const sendVerificationEmail = async (user, res) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();
  // console.log(accessToken);
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.Authemail,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // console.log(user);
  console.log("aadish");
  const { _id, email, firstname } = user;
  // console.log(_id+" "+email);
  const token = _id + uuid4;
  // console.log(token);
  const link = "https://google.com";
  // const link = url + "users/verify" + _id + "/" + token;
  const mailOptions = {
    from: process.env.Authemail,
    to: email,
    subject: "Email Verification",
    html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <title>Email Confirmation</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style type="text/css">
              @media screen {
                @font-face {
                  font-family: "Source Sans Pro";
                  font-style: normal;
                  font-weight: 400;
                  src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                      format("woff");
                }
                @font-face {
                  font-family: "Source Sans Pro";
                  font-style: normal;
                  font-weight: 700;
                  src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                      format("woff");
                }
              }
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
              img {
                -ms-interpolation-mode: bicubic;
              }
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              table {
                border-collapse: collapse !important;
              }
              a {
                color: #1a82e2;
              }
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
            </style>
          </head>
          <body style="background-color: #e9ecef">
            <div
              class="preheader"
              style="
                display: none;
                max-width: 0;
                max-height: 0;
                overflow: hidden;
                font-size: 1px;
                line-height: 1px;
                color: #fff;
                opacity: 0;
              "
            >
              Please open this email to verify your email
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <![endif]-->
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
                  >
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
                  >
                    <tr>
                      <td
                        align="left"
                        bgcolor="#ffffff"
                        style="
                          padding: 36px 24px 0;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          border-top: 3px solid #d4dadf;
                        "
                      >
                      
                      <h1
                      style="
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: -1px;
                        line-height: 48px;
                      "
                    >
                      Hi ${firstname}
                    </h1>
                        <h1
                          style="
                            margin: 0;
                            font-size: 32px;
                            font-weight: 700;
                            letter-spacing: -1px;
                            line-height: 48px;
                          "
                        >
                          Confirm Your Email Address
                        </h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
                  >
                    <tr>
                      <td
                        align="left"
                        bgcolor="#ffffff"
                        style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        "
                      >
                        <p style="margin: 0">
                          Tap the button below to confirm your email address. If you
                          didn't create an account with <a href="{link}">Paste</a>, you
                          can safely delete this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" bgcolor="#ffffff">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center" bgcolor="#ffffff" style="padding: 12px">
                              <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td
                                    align="center"
                                    bgcolor="#1a82e2"
                                    style="border-radius: 6px"
                                  >
                                    <a
                                    href=${link}
                                      style="
                                        display: inline-block;
                                        padding: 16px 36px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial,
                                          sans-serif;
                                        font-size: 16px;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 6px;
                                      "
                                      >Verify Your Email Address</a
                                    ></a>
                                    
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#ffffff"
                        style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        "
                      >
                        <p style="margin: 0">
                          If that doesn't work, copy and paste the following link in
                          your browser:
                        </p>
                        <p style="margin: 0">
                          <a href=${link} target="_blank">Site</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        bgcolor="#ffffff"
                        style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                          border-bottom: 3px solid #d4dadf;
                        "
                      >
                        <p style="margin: 0">
                          Best Regards,<br />
                          From SocialHub
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 24px">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
                  >
                    <tr>
                      <td
                        align="center"
                        bgcolor="#e9ecef"
                        style="
                          padding: 12px 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #666;
                        "
                      >
                        <p style="margin: 0">
                          You received this email because we received a request for your
                          account. If you didn't request you can safely delete this
                          email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>        
        `,
  };
  try {
    const hashtoken = await hashFunction(token);
    console.log(hashtoken);
    const newVerifiedEmail = await verify.create({
      userId: _id,
      token: hashtoken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 14000000,
    });
    // console.log(newVerifiedEmail);
    if (newVerifiedEmail) {
      // console.log(transport);
      transport
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "Pending",
            message:
              "Verification email has been sent to your account.Please check your email for further actions",
          });
        })
        .catch((e) => {
          // console.log(e);
          res.status(404).json({ message: "Something Went Wrong" });
        });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(404)
      .json({ message: "Something went wrong sorry for inconvenience" });
  }
};
const ResetPassword = async (user, res) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();
  // console.log(accessToken);
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.Authemail,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { _id, email } = user;
  // console.log(user);
  const token = _id + uuid4;
  const link = `https://localhost:3000/user/reset-password/${_id}/${token}`;
  console.log(link);
  const mailOptions = {
    from: process.env.Authemail,
    to: email,
    subject: "Email Verification",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title></title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="css/style.css" rel="stylesheet" />
        <!-- Latest compiled and minified CSS -->
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </head>
      <body>
        <div class="card text-center" style="width: 300px">
          <div class="card-header h5 text-white bg-primary">Password Reset</div>
          <div class="card-body px-5">
            <p class="card-text py-2">Password Reset Link.Please Click the link below to the reset password </p>
            <p class="card-text py-2"><b>Link Will Be Expired in 10 minutes</b> </p>
            <a href=${link} class="btn btn-primary w-100">Reset password</a>
          </div>
        </div>
      </body>
    </html>
    `,
  };
  try {
    const hashtoken = await hashFunction(token);
    console.log(hashtoken);
    const newPasswordReset = await password.create({
      userId: _id,
      email: email,
      token: hashtoken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 14000000,
    });
    if (newPasswordReset) {
      transport
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "Pending",
            message: "Password reset link has been sent to your email",
          });
        })
        .catch((e) => {
          console.log(e.message);
          res.status(404).json({ message: "Something went wrong sorry for inconvenience" });
        });
    }
  } catch (error) {}
};
module.exports = { sendVerificationEmail,ResetPassword };
