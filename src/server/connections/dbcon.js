const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const collectionName = 'rooms';
const mongoUrl = 'mongodb://localhost:27017/663';

const defaultState = {showCompleted: true, tasks: []};

const dbcon = (callback) => {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) {
            handleErr(err);
        }

        const readRoom = (roomId, handleErr, callback) => {
            db.collection(collectionName).findAndModify(
                {roomId},
                [],
                {$setOnInsert: Object.assign({}, defaultState, {roomId})},
                {new: true, upsert: true},
                (err, doc) => {
                    if (err) {
                        handleErr(err);
                    }
                    callback(doc.value);
                }
            );
        };

        const writeRoom = (roomId, newState, handleErr, callback) => {
            delete newState._id;
            db.collection(collectionName).updateOne({roomId}, newState, {upsert: true}, (err, res) => {
                if (err) {
                    handleErr(err);
                }
                callback(res);
            });
        };

        callback(db, readRoom, writeRoom);
    });
};

module.exports = dbcon;
