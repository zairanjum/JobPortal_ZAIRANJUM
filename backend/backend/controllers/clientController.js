const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const Payment = require("../models/payment");
const { isValidObjectId } = require("mongoose");
const ResetPasswordToken = require("../models/resetPasswordToken");
const VerificationToken = require("../models/verificationTokenSchema");
const { createRandomBytes } = require("../utils/tokenGenreator");
const Conversation = require("../models/conversationModel");
const {
  generateOTP,
  mail,
  generateEmailTemplate,
  generateForgotPasswordTemplate,
  generateResetPasswordComplete,
  generateverifySucceesfullyTemplate,
  generateVerificationTokenTemplate,
} = require("../utils/mail");

const bufferConversion = require("../helpers/bufferConversion");
const cloudinary = require("../helpers/cloudinary");

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find();
  res.status(200).json(clients);
});

const getOneClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }

  res.status(200).json(client);
});

// / Update Clien profile /

const updateClientProfile = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  const { phoneNumber, gender, languages, address } = req.body;

  const photo = bufferConversion(req?.file?.originalname, req?.file?.buffer);

  const { secure_url } = await cloudinary.uploader.upload(photo);

  if (!phoneNumber || !gender || !languages || !photo || !address) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!req?.file?.mimetype)
    return res.status(400).json({ message: "select Profile Photo" });

  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }

  // Make sure the logged in client matches the his id
  if (client.id !== req.client.id) {
    res.status(401);
    throw new Error("client not authorized to update profile");
  }

  req.body.photo = secure_url;

  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,

    {
      new: true,
    }
  );

  res.status(200).json(updatedClient);
});

// / update client email password and username /

const updateClientAccount = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  const { password, email } = req.body;

  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }
  // Check for client
  if (!req.client) {
    res.status(401);
    throw new Error("client requesting update not found");
  }

  // Make sure the logged in client matches the his id
  if (client.id !== req.client.id) {
    res.status(401);
    throw new Error("client not authorized to update account");
  }

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(400).json({ errorMessage: "Email already exists" });
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }

  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,

    {
      new: true,
    }
  );

  res.status(200).json(updatedClient);
});

const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }

  if (client.id !== req.client.id) {
    res.status(401);
    throw new Error("client not authorized to delete");
  }

  await client.remove();

  res.status(200).json({ id: req.params.id });
});

// auth work for client

//REGISTER CLIENT

const registerClient = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, verified } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    res.status(403).json({ errorMessage: "Client already exists" });
  }

  // Create client create ho jai fa
  const client = await Client.create({
    firstName,
    lastName,
    email,
    verified,
    password,
    profile: req.body,
  });

  const OTP = generateOTP();

  const verificationToken = await VerificationToken.create({
    owner: client._id,
    token: OTP,
  });

  const conversation = new Conversation({
    freelancer1: client._id,
    client1: client._id,
    admin1: client._id,
    freelancer2: "6386eceb9fc1c111acb076d9",
    client2: "6386eceb9fc1c111acb076d9",
    admin2: "6386eceb9fc1c111acb076d9",
  });

  if (client) {
    res.status(201).json({
      _id: client.id,
      email: client.email,
      token: generateToken(client._id),
      OTP: await verificationToken.save(),
      adminChat: await conversation.save(),
    });
    mail().send({
      from: "zairanjum66@gmail.com",
      to: client.email,
      subject: "Verify your email account",
      html: generateEmailTemplate(OTP),
    });
  } else {
    res.status(400);
    throw new Error("Invalid client data");
  }
});

const loginClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for client email
  const client = await Client.findOne({ email });

  if (client && (await bcrypt.compare(password, client.password))) {
    res.json({
      _id: client.id,
      email: client.email,
      token: generateToken(client._id),
    });
  } else {
    res.status(401).json({ errorMessage: "Invalid Client Credentials" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { clientId, otp } = req.body;
  if (!clientId || !otp.trim())
    return res
      .status(400)
      .json({ errorMessage: "Invalid request, missing parameters!" });

  if (!isValidObjectId(clientId))
    return res.status(400).json({ errorMessage: "Invalid client id!" });

  const client = await Client.findById(clientId);
  if (!client)
    return res.status(400).json({ errorMessage: "Sorry, client not found!" });

  if (client.verified)
    return res
      .status(400)
      .json({ errorMessage: "This account is already verified!" });

  const token = await VerificationToken.findOne({ owner: client._id });
  if (!token)
    res.status(400).json({ errorMessage: "Sorry, client not found!" });

  const isMatched = await token.compareToken(otp);
  if (!isMatched)
    return res
      .status(400)
      .json({ errorMessage: "Please provide a valid OTP!" });
  client.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);
  await client.save();

  mail().send({
    from: "zairanjum66@gmail.com",
    to: client.email,
    subject: "Verify your email account",
    html: generateverifySucceesfullyTemplate(
      `<h1>Your email have been verified successfully <h1/>`
    ),
  });

  res.status(201).json({
    success: true,
    message: "your email is verified. ",
    client: {
      _id: client.id,
      email: client.email,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(403).json({ errorMessage: "  Please Provide a valid Email" });
  }

  const client = await Client.findOne({ email });
  if (!client) {
    res.status(403).json({ errorMessage: "  User not found invalid Request" });
  }

  const token = await ResetPasswordToken.findOne({
    owner: client._id,
  });
  if (token)
    return res
      .status(403)
      .json({ errorMessage: "Only after one hour you can request new token" });

  const randomBytes = await createRandomBytes();

  const resetPasswordToken = await ResetPasswordToken.create({
    owner: client._id,
    token: randomBytes,
  });

  await resetPasswordToken.save();

  mail().send({
    from: "zairanjum66@gmail.com",
    to: client.email,
    subject: "Password Reset",
    html: generateForgotPasswordTemplate(
      `<h1><a href="http://localhost:3000/reset-password-client?token=${randomBytes}&id=${client._id}">Visit TitForTat!</a><h1/>`
    ),
  });

  res.json({
    success: true,
    successMessage: "Password reset link is sent to your email. ",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const client = await Client.findById(req.client._id);
  if (!client) {
    res.status(403).json({
      errorMessage: "client not found! ",
    });
  }
  if (password.trim().length < 8 || password.trim().length > 20) {
    res.status(403).json({
      errorMessage: "Password must be 8 to 20 characters long! ",
    });
  }

  client.password = password.trim();
  await client.save();

  await ResetPasswordToken.findOneAndDelete({ owner: client._id });

  mail().send({
    from: "zairanjum66@gmail.com",
    to: client.email,
    subject: "Password Reset Completed",
    html: generateResetPasswordComplete(
      `<!h1>Your Password was successfully reset</h1>`
    ),
  });

  res.json({
    success: true,
    successMessage: "Password is successfully reset. ",
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, type: "client" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sendVerificationToken = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(403).json({ errorMessage: "User not found invalid Request" });
  }

  const OTP = generateOTP();

  const verificationToken = await VerificationToken.create({
    owner: client._id,
    token: OTP,
  });

  if (client) {
    res.status(201).json({
      _id: client.id,
      email: client.email,
      token: generateToken(client._id),
      OTP: await verificationToken.save(),
    });
    mail().send({
      from: "zairanjum66@gmail.com",
      to: client.email,
      subject: "Verify your email account",
      html: generateVerificationTokenTemplate(OTP),
    });
  } else {
    res.status(400);
    throw new Error("No Client Found ");
  }
});

const getClientPayment = asyncHandler(async (req, res) => {
  // Find the client with the specified ID
  const client = await Client.findById(req.params.id);

  // If the client does not exist, return an error
  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }

  // Find all payments made by the client
  const payments = await Payment.find({
    userId: client._id,
  });

  // Return the list of payments
  res.status(200).json(payments);
});

const deleteClientPayment = asyncHandler(async (req, res) => {
  // Find the payment with the specified ID
  const payment = await Payment.findById(req.params.id);

  // If the payment does not exist, return an error
  if (!payment) {
    res.status(400);
    throw new Error("payment not found");
  }

  // Find the client associated with the payment
  const client = await Client.findById(payment.userId);

  // If the client does not exist, return an error
  if (!client) {
    res.status(400);
    throw new Error("client not found");
  }

  // Delete the payment
  await payment.remove();

  // Return a success message
  res.status(200).json({ success: true, message: "payment deleted" });
});

module.exports = {
  getClients,
  updateClientAccount,
  updateClientProfile,
  deleteClient,
  getOneClient,
  registerClient,
  loginClient,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendVerificationToken,
  getClientPayment,
  deleteClientPayment,
};
