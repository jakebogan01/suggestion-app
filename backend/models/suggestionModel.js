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
            required: [ true, "Slug is required" ],
            unique: [ true, "Slug already exists" ],
        },
        description: {
            type: String,
            required: [ true, "Description is required" ],
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model( "Suggestion", SuggestionSchema );