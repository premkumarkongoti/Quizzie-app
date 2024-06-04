const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    isAnswer: {
        type: Boolean,
        default: false,
    },
    imgUrl: {
        type: String,
        default: "",
    },
    votes: {
        type: Number,
        default: 0,
    },
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    optionType: {
        type: String,
        enum: ["text", "image", "text_image"],
        required: true,
    },
    attempted: {
        type: Number,
        default: 0,
    },
    correct: {
        type: Number,
        default: 0,
    },
    incorrect: {
        type: Number,
        default: 0,
    },
    options: [optionSchema],
});

const quizSchema = new mongoose.Schema(
    {
        quizName: {
            type: String,
            required: true,
        },
        quizType: {
            type: String,
            enum: ["qna", "poll"],
            required: true,
        },
        questions: [questionSchema],
        impressions: {
            type: Number,
            default: 0,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        timer: {
            type: String,
            enum: ["5min", "10min", "off"],
            default: "off",
        },
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
