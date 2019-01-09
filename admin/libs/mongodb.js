const {
    MongoClient,
    ObjectId
} = require('mongodb');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'admin2';
// Use connect method to connect to the server

let connect = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, client) => {
            if (err) {
                reject(err)
            } else {
                console.log("Connected successfully to server");
                const db = client.db(dbName);
                resolve({
                    db,
                    client
                })
            }
        });
    })
}

let insert = (col, arr) => {
    return new Promise(async(resolve, reject) => {
        let {
            db,
            client
        } = await connect();
        const collection = db.collection(col);
        collection.insertMany(arr, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
                client.close();
            }
        })
    })
}

let find = (col, obj) => {
    return new Promise(async(resolve, reject) => {
        let {
            db,
            client
        } = await connect();
        const collection = db.collection(col);
        collection.find({
            ...obj
        }).toArray(function(err, docs) {
            if (err) {
                reject(err)
            } else {
                resolve(docs);
                client.close();
            }
        });
    })
}

let findSort = (col, obj) => {
    return new Promise(async(resolve, reject) => {
        let {
            db,
            client
        } = await connect();
        const collection = db.collection(col);
        collection.find({}).sort({
            ...obj
        }).toArray(function(err, docs) {
            if (err) {
                reject(err)
            } else {
                resolve(docs);
                client.close();
            }
        });
    })
};


//删除
let del = (col, obj) => {
    return new Promise(async(resolve, reject) => {
        let {
            db,
            client
        } = await connect();
        const collection = db.collection(col);
        collection.deleteMany({
            ...obj
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    connect,
    insert,
    find,
    findSort,
    ObjectId,
    del
}

// node express mongodb jquery