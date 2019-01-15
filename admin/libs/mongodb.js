const {
    MongoClient,
    ObjectId
} = require('mongodb');
// Connection URL
// const url = 'mongodb://47.93.0.253:27017';
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

//更新
let update = (col, obj1, obj2) => {
    return new Promise(async(resolve, reject) => {
        let {
            db,
            client
        } = await connect();
        const collection = db.collection(col);
        collection.update({
            ...obj1
        }, {...obj2 }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        });
    })
}

//分页查询
// let findFeng = (col, obj, page, pagesize) => {
//     return new Promise(async(resolve, reject) => {
//         let {
//             db,
//             client
//         } = await connect();
//         const collection = db.collection(col);
//         collection.find({
//             ...obj
//         }).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize)).toArray(function(err, docs) {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(docs);
//                 client.close();
//             }
//         });
//     })
// }

//分页查询
let findFeng = (col, obj, page, pagesize) => {
    let result = {}
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
                result.total = null
            } else {
                result.total = docs.length
            }
        })

        collection.find({
                ...obj
            }).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
            .toArray(function(err, docs) {
                if (err) {
                    result.err = -1
                    reject(result)
                } else {
                    result.data = docs
                    result.err = 0
                    resolve(result);
                    client.close();
                }
            })
    })
}


module.exports = {
    connect,
    insert,
    find,
    findSort,
    ObjectId,
    del,
    update,
    findFeng
}

// node express mongodb jquery