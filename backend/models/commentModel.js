const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        body: {
            type: String,
            required: [ true, "Body is required" ],
        },
        suggestion: {
            type: Schema.Types.ObjectId,
            ref: "Suggestion",
            required: true
        }
    },
    { timestamps: true }
);

CommentSchema.virtual("replies", {
    ref: "Reply",
    localField: "_id",
    foreignField: "comment"
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model( "Comment", CommentSchema );