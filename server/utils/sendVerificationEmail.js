const  verify=require("../models/emailVerification");
const  {hashFunction, hashString}=require("./hashPassword")
const nodemailer = require("nodemailer");
const uuid4 = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
// const { Authemail, pass, url } = process.env
// console.log(+" "+);
// const {Authemail}=process.env.Authemail
// const {password}=process.env.pass
let transport = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.Authemail,
    pass: process.env.pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});
 const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastname } = user;
  // console.log(_id+" "+email);
  const token = _id + uuid4;
  // console.log(token);
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
              A preheader is the short summary text that follows the subject line when
              an email is viewed in the inbox.
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
                    <tr>
                      <td align="center" valign="top" style="padding: 36px 24px">
                        <a
                          href="https://www.blogdesire.com"
                          target="_blank"
                          style="display: inline-block"
                        >
                          <img
                            src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png"
                            alt="Logo"
                            border="0"
                            width="48"
                            style="
                              display: block;
                              width: 48px;
                              max-width: 48px;
                              min-width: 48px;
                            "
                          />
                        </a>
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
                                      href="{link}"
                                      target="_blank"
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
                                    >
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
                          <a href="{link}" target="_blank">Site</a>
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
    const hashtoken=await hashFunction(token)
    // console.log(hashtoken);
    const newVerifiedEmail=await verify.create({
        userId:_id,
        token:hashtoken,
        createdAt:Date.now(),
        expiresAt:Date.now()+4000000
    })
    // console.log(newVerifiedEmail);
    if(newVerifiedEmail)
    {
      console.log(transport);
      transport.sendMail(mailOptions).then(()=>{
        res.status(201).send({
          success:"Pending",
          message:"Verification email has been sent to your account.Please check your email for further actions"
        })
      }).catch((e)=>{
        console.log(e);
        res.status(404).json({message:"Something Went Wrong"})
      })
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(404)
      .json({ message: "Something went wrong sorry for inconvenience" });
  }
};
module.exports={sendVerificationEmail}
