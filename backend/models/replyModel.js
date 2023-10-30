const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const ReplySchema = new Schema(
    {
        body: {
            type: String,
            required: [ true, "Body is required" ],
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model( "Reply", ReplySchema );