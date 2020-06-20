const mongoose = require('mongoose');


const regex = /^[a-fA-F0-9]{24}$/

function validateObjectID(id) {
    if (!mongoose.Types.ObjectId.isValid(id) || !id.match(regex))
        return false;
    return true;
}

module.exports = {
    validateObjectID: validateObjectID
}