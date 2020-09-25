var express = require("express");
var router = express.Router();
var isLoggedIn = require("./custom_modules/isLoggedIn.js");
var connection = require("./custom_modules/connection");
var queries = require("./custom_modules/queries.js");

router.get("/access", isLoggedIn, function (req, res) {
  //look at later
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("access", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

//////SEARCH ROUTES//////

router.get("/search", function (req, res) {
  connection.query(
    queries.searchCodes +
      req.query.q +
      '%" OR prd_code LIKE "%' +
      req.query.q +
      '%"',
    function (err, rows, fields) {
      if (err) throw err;
      var data = {
        results: [],
      };
      for (i = 0; i < rows.length; i++) {
        var object = {
          title: rows[i].prd_code,
          description: rows[i].prd_name,
        };
        data.results.push(object);
      }
      res.send(JSON.stringify(data));
    }
  );
});

router.post("/search", function (req, res) {
  connection.query(
    queries.stores +
      'SELECT `prd_id`, `prd_code`, `prd_name`, `pim_id` FROM `product` JOIN `product_image` ON `prd_id` = `pim_prd_id` WHERE `prd_code` LIKE "%' +
      req.body.search +
      '%" OR `prd_name` LIKE "%' +
      req.body.search +
      '%" GROUP BY `prd_id`;' +
      queries.userName,
    req.user.username,
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        var obj = JSON.parse(JSON.stringify(rows[1]));
        res.render("product_search_table", {
          obj: obj,
          rows: rows[0],
          profile: rows[2][0],
        });
      }
    }
  );
});

///////OLD PRODUCT SEARCH ROUTES///////

router.get("/productsearch", isLoggedIn, function (req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("productsearch", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

router.get("/product_search_table", isLoggedIn, function (req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("product_search_table", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

router.get("/product_search_table", function (req, res) {
  connection.query(
    queries.typeAheadProduct + req.query.key + '%" LIMIT 1;',
    function (err, rows, fields) {
      if (err) throw err;
      var data = [];
      for (i = 0; i < rows.length; i++) {
        data.push(rows[i].pim_id);
      }
      res.end(JSON.stringify(data));
    }
  );
});

///////OLD CUSTOMER SEARCH ROUTES/////////

router.get("/searchcustomer", function (req, res) {
  connection.query(queries.typeAheadName + req.query.q + '%"', function (
    err,
    rows,
    fields
  ) {
    if (err) throw err;
    var data = {
      results: [],
    };
    for (i = 0; i < rows.length; i++) {
      var object = {
        title: rows[i].usr_fullname,
      };
      data.results.push(object);
    }
    res.end(JSON.stringify(data));
  });
});

router.post("/searchcustomer", function (req, res) {
  connection.query(
    queries.stores +
      queries.searchName +
      req.body.search +
      '%";' +
      queries.userName,
    req.user.username,
    function (err, rows) {
      var obj = JSON.parse(JSON.stringify(rows[1]));
      res.render("customer_search_table", {
        obj: obj,
        rows: rows[0],
        profile: rows[2][0],
      });
    }
  );
});

router.get("/customersearch", isLoggedIn, function (req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("customersearch", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

router.get("/customer_search_table", isLoggedIn, function (req, res) {
  connection.query(
    queries.stores + queries.userName,
    req.user.username,
    function (err, rows, fields) {
      res.render("customer_search_table", {
        user: req.user,
        rows: rows[0],
        profile: rows[1][0],
      });
    }
  );
});

////////// INVENTORY DB SEARCH ROUTES ///////////
router.get("/searchdb", function (req, res) {
  connection.query(
    queries.searchCodes +
      req.query.q +
      '%" OR prd_code LIKE "%' +
      req.query.q +
      '%"',
    function (err, rows, fields) {
      if (err) throw err;
      var data = {
        results: [],
      };
      for (i = 0; i < rows.length; i++) {
        var object = {
          title: rows[i].prd_code,
          description: rows[i].prd_name,
        };
        data.results.push(object);
      }
      res.send(JSON.stringify(data));
    }
  );
});

router.get("/searchcodes", function (req, res) {
  connection.query(
    queries.searchCodes +
      req.query.q +
      '%" OR prd_code LIKE "%' +
      req.query.q +
      '%"',
    function (err, rows, fields) {
      if (err) throw err;
      var data = {
        results: [],
      };
      for (i = 0; i < rows.length; i++) {
        var object = {
          title: rows[i].prd_code,
          description: rows[i].prd_name,
        };
        data.results.push(object);
      }
      res.send(JSON.stringify(data));
    }
  );
});

router.post("/searchdb", function (req, res) {
  connection.query(
    queries.stores +
      'SELECT `prd_id`, `prd_code`, `prd_name`, `pim_id` FROM `product` JOIN `product_image` ON `prd_id` = `pim_prd_id` WHERE `prd_code` LIKE "%' +
      req.body.search +
      '%" OR `prd_name` LIKE "%' +
      req.body.search +
      '%" GROUP BY `prd_id`;' +
      queries.userName,
    req.user.username,
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        var obj = JSON.parse(JSON.stringify(rows[1]));
        res.render("product_search_table", {
          obj: obj,
          rows: rows[0],
          profile: rows[2][0],
        });
      }
    }
  );
});

module.exports = router;
