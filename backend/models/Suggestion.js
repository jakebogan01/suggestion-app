const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuggestionSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        tag_id: {
            type: String,
            required: true,
        },
        department_id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: [true, "Slug already exists"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
    },
    { timestamps: true }
);