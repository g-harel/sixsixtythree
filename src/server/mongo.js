const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const collectionName = 'rooms';
const mongoUrl = 'mongodb://localhost:27017/663';

MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
        callback(Object.assign({}, defaultState));
    }
    db.collection(collectionName).find({a: 0}).toArray((err, res) => {
        if (err) {
            callback(Object.assign({}, defaultState));
        }
        console.log(res);
    });
    db.close();
});
