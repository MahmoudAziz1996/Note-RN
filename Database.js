import SQLite from "react-native-sqlite-storage";
import {Alert} from 'react-native'
// SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Notes.db";
const database_version = "1.0";
const database_displayname = "Note";
const database_size = 200000;

export default class Database {

    initDB() {
        let db;
        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            db.executeSql('SELECT 1 FROM Product LIMIT 1').then(() => {
                                console.log("Database is ready ... executing query ...");
                            }).catch((error) => {
                                console.log("Received error: ", error);
                                console.log("Database not yet ready ... populating data");
                                db.transaction((tx) => {
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS Product (prodId INTEGER PRIMARY KEY AUTOINCREMENT , prodName TEXT NOT NULL, prodDesc TEXT NOT NULL , prodImage Text)');
                                }).then(() => {
                                }).catch(error => {
                                    console.log(error);
                                });
                            });
                            resolve(db);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                });
        });
    };

    closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
      };


      listProduct() {
        return new Promise((resolve) => {
          const products = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT p.prodId, p.prodName, p.prodImage FROM Product p', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  console.log(`Prod ID: ${row.prodId}, Prod Name: ${row.prodName}`)
                  const { prodId, prodName, prodImage } = row;
                  products.push({
                    prodId,
                    prodName,
                    prodImage
                  });
                }
                console.log(products);
                resolve(products);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      productById(id) {
        console.log(id);
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx,results]) => {
                console.log(results);
                if(results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      addProduct(prod) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO Product VALUES (?,?, ?, ?)', [ null, prod.prodName, prod.prodDesc, prod.prodImage]).then(([tx, results]) => {
                resolve(results);
                Alert.alert("Added")
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }


      updateProduct(id, prod) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ? WHERE prodId = ?', [prod.prodName, prod.prodDesc, prod.prodImage, id]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
              console.log(result);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }


      deleteProduct(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM Product WHERE prodId = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

}