const mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/fusor-demo', ['Deployments']);
//TODO break out the steps into it's own collection and use Mongoose.

class DataObject {
  constructor(data) {
    this.data = data;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.data.find((err, documents) => {
        if (err) {
          return reject(err);
        }
        return resolve(documents);
      });
    });
  }

  find(id) {
    if (!id) {
      return this.getAll();
    } else {
      return new Promise((resolve, reject) => {
        this.data.findOne({
          _id: mongojs.ObjectId(id)
        }, (err, document) => {
          if (err) {
            return reject(err);
          }
          return resolve(document);
        });
      });
    }
  }

  insert(object) {
    return new Promise((resolve, reject) => {
      this.data.insert(object, (err, document) => {
        if (err) {
          return reject(err);
        }
        return resolve(document);
      })
    });
  }

  update(id, object) {
    return new Promise((resolve, reject) => {
      this.data.update(
        {_id: mongojs.ObjectId(id)},
        object,
        (err, document) => {
          if (err) {
            return reject(err);
          }
          return resolve(document);
        })
    });
  }

  remove(id) {
    return new Promise((resolve, reject) => {
      this.data.remove(
        {_id: mongojs.ObjectId(id)},
        (err, document) => {
          if (err) {
            return reject(err);
          }
          return resolve(document);
        })
    });
  }
}

const Deployment = new DataObject(db.Deployments);


module.exports = {Deployment};