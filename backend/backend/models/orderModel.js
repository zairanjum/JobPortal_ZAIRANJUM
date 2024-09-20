const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OrderModel = mongoose.Schema(
  {
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proposal",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
    },
    price: {
      type: Number,
      require: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
    },

    jobOrderType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobProposal",
    },
    exchangeSkillsOrderType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proposal",
    },
    gigOrderType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GIGS",
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    type: {
      type: String,
      require: true,
    },
    status: {
      type: Number,
      require: true,
    },
    duration: {
      type: String,
      require: true,
    },
    OrderExp: {
      type: String,
    },
    reviewed: {
      type: Number,
      require: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderModel", OrderModel);
