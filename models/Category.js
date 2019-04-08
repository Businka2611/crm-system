const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: ''
    },
    user: {
        ref: 'user',
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('categories', categorySchema);