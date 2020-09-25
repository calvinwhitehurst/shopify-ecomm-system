var express = require("express");
var router = express.Router();
var connection = require("./custom_modules/connection");
var dbsync = require("./custom_modules/dbsync.js");
const axios = require("axios");
const cron = require("node-cron");

cron.schedule("00 30 * * * *", function () {
  return new Promise(function (resolve, reject) {
    connection.query(
      "SELECT api_key, pswrd, shop_url, id, warehouse FROM stores;",
      function (err, rows) {
        for (var i = 0; i < rows.length; i++) {
          var cred =
            "https://" +
            rows[i].api_key +
            ":" +
            rows[i].pswrd +
            "@" +
            rows[i].shop_url +
            "/admin/api/2019-10/";
          var id = rows[i].id;
          var warehouse = rows[i].warehouse;
          dbsync(cred, id, warehouse);
        }
        if (err) {
          //throw err;
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
});

router.post("/inventory/(:id)", (req, res, next) => {
  console.log("inventory post");
  var location_id = req.params.id;
  let order = JSON.parse(JSON.stringify(req.body));
  for (let i = 0, p = Promise.resolve(); i < order.line_items.length; i++) {
    p = p.then(
      (_) =>
        new Promise((resolve) =>
          connection.query(
            "SET @p0='" +
              location_id +
              "'; SET @p1='" +
              order.line_items[i].quantity +
              "'; SET @p2='" +
              order.line_items[i].sku +
              "'; CALL `AllStoreIds`(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7); SELECT @p3 AS `LocId`, @p4 AS `VarId`, @p5 AS `Api`, @p6 AS `Pswrd`, @p7 AS `Url`;",
            function (err, rows, fields) {
              console.log(
                order.line_items[i].quantity +
                  " " +
                  order.line_items[i].sku +
                  " logged."
              );
              if (typeof rows[4] !== "undefined" && null != rows[4][0].LocId) {
                axios
                  .post(
                    "https://" +
                      rows[4][0].Api +
                      ":" +
                      rows[4][0].Pswrd +
                      "@" +
                      rows[4][0].Url +
                      "/admin/api/2020-04/inventory_levels/adjust.json",
                    {
                      location_id: rows[4][0].LocId,
                      inventory_item_id: rows[4][0].VarId,
                      available_adjustment: -order.line_items[i].quantity,
                    }
                  )
                  .then(function () {
                    console.log("axios fired " + [i]);
                    resolve();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } else {
                console.log("axios did not fire " + [i]);
                resolve();
              }
            }
          )
        )
    );
  }
  res.sendStatus(200);
});

router.post("/cancellation/(:id)", (req, res, next) => {
  console.log("cancellation post");
  var location_id = req.params.id;
  let order = JSON.parse(JSON.stringify(req.body));
  for (let i = 0, p = Promise.resolve(); i < order.line_items.length; i++) {
    p = p.then(
      (_) =>
        new Promise((resolve) =>
          connection.query(
            "SET @p0='" +
              location_id +
              "'; SET @p1='" +
              order.line_items[i].quantity +
              "'; SET @p2='" +
              order.line_items[i].sku +
              "'; CALL `AllStoreIdsCancel`(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7); SELECT @p3 AS `LocId`, @p4 AS `VarId`, @p5 AS `Api`, @p6 AS `Pswrd`, @p7 AS `Url`;",
            function (err, rows, fields) {
              console.log(
                order.line_items[i].quantity +
                  " " +
                  order.line_items[i].sku +
                  " logged."
              );
              if (typeof rows[4] !== "undefined" && null != rows[4][0].LocId) {
                axios
                  .post(
                    "https://" +
                      rows[4][0].Api +
                      ":" +
                      rows[4][0].Pswrd +
                      "@" +
                      rows[4][0].Url +
                      "/admin/api/2020-04/inventory_levels/adjust.json",
                    {
                      location_id: rows[4][0].LocId,
                      inventory_item_id: rows[4][0].VarId,
                      available_adjustment: order.line_items[i].quantity,
                    }
                  )
                  .then(function () {
                    console.log("axios fired " + [i]);
                    resolve();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } else {
                console.log("axios did not fire " + [i]);
                resolve();
              }
            }
          )
        )
    );
  }
  res.sendStatus(200);
});

module.exports = router;
