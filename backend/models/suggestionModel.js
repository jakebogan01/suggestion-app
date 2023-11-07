const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const SuggestionSchema = new Schema(
    {
        title: {
            type: String,
            required: [ true, "Title is required" ],
        },
        slug: {
            type: String,
            unique: [ true, "Title is already in use" ],
        },
        description: {
            type: String,
            required: [ true, "Description is required" ],
        },
        department: {
            type: String,
            required: [ true, "Department is required" ],
        },
        tag: {
            type: String,
            required: [ true, "Tag is required" ],
        },
        user_id: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

SuggestionSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "suggestion"
});

SuggestionSchema.set("toObject", { virtuals: true });
SuggestionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model( "Suggestion", SuggestionSchema );