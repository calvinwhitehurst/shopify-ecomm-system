var moment = require("moment");
var mysqlTimestamp = moment(Date.now()).format("MMMM Do YYYY, h:mm a");
module.exports = {
  epicDelete: "DELETE FROM epic_vendor WHERE variant_sku = ?;",
  epicInsert: "INSERT INTO epic_vendor SET ?;",
  epicUpdate:
    "UPDATE epic_vendor SET title = ?, variant_sku = ?, variant_barcode = ?, vendor = ?, variant_price = ?, cost_per_item = ? WHERE variant_sku = ?;",
  epicVendor: 'SELECT * FROM `epic_vendor` WHERE `title` LIKE "%',
  harmDelete: "DELETE FROM harm_codes WHERE harm_id = ?;",
  harmInsert: "INSERT INTO harm_codes SET ?;",
  inventoryUpdate: "UPDATE store_fbaus_var SET inv = ? WHERE inv_id = ?;",
  loginUpdate:
    'UPDATE `users` SET `lastLogin` = "' +
    mysqlTimestamp +
    '" WHERE `username` = ?;',
  photoQueueCreate:
    "CREATE TABLE IF NOT EXISTS `photo_download_queue` (`queue_id` int NOT NULL AUTO_INCREMENT, `prod_id` varchar(20) NOT NULL UNIQUE, `storecred` varchar(200) NOT NULL, `downloaded` int NOT NULL, PRIMARY KEY (`queue_id`));",
  photoQueueSync:
    "INSERT IGNORE INTO `photo_download_queue` (prod_id, storecred, downloaded) VALUES ",
  product:
    "SELECT prd_id, prd_code, prd_name, prd_desc from product where prd_id = ?;",
  productSync:
    "INSERT IGNORE INTO `product` (`prd_id`,`prd_code`,`prd_name`,`prd_desc`) VALUES ",
  profile:
    "SELECT `id`, `username`, `password`, `picture` FROM `users` WHERE `id` = ?;",
  stores: "SELECT * FROM stores;",
  storesCreate:
    "CREATE TABLE IF NOT EXISTS stores (id BIGINT(32) NOT NULL, abbrev varchar(255), name varchar(255), api_key varchar(255), pswrd varchar(255), shop_url varchar(255), logo_url varchar(255), country INT(1), email varchar(60), warehouse int(3) NOT NULL, PRIMARY KEY(id));",
  storesDelete: "DELETE FROM stores WHERE id = ?",
  storesInsert: "INSERT INTO stores SET ?;",
  storesUpdate:
    "UPDATE stores SET id = ?, abbrev = ?, name = ?, api_key = ?, pswrd = ?, shop_url = ?, logo_url = ?, country = ?, email = ?, warehouse = ? WHERE id = ?;",
  storesWhereId: "SELECT * FROM stores WHERE id = ?;",
  searchCodes: 'SELECT prd_name, prd_code FROM product WHERE prd_code LIKE "%',
  searchName: 'SELECT * FROM `user` WHERE `usr_fullname` LIKE "%',
  searchProduct:
    'SELECT p.title AS name , v.sku AS var_sku FROM store_var v JOIN store_prod p ON v.prod_id = p.prod_id WHERE v.sku LIKE "%',
  searchDb:
    'SELECT w.shortname AS warehouse, s.name AS storename, v.title AS variant, p.title, inv, v.var_id, v.sku, v.storeid FROM store_var v JOIN store_prod p ON v.prod_id = p.prod_id JOIN warehouses w ON v.warehouse_id = w.id JOIN stores s ON v.storeid = s.id WHERE v.sku LIKE "%',
  storeProdCreate:
    "CREATE TABLE IF NOT EXISTS `store_prod` (`prod_id` varchar(20) NOT NULL,`sku` varchar(20) not null, `title` text NOT NULL, `storeid` BIGINT(32) NOT NULL, PRIMARY KEY (`prod_id`));",
  storeProdSync:
    "INSERT IGNORE INTO `store_prod` (`prod_id`, `sku`, `title`, `storeid`) VALUES ",
  storeVarCreate:
    "CREATE TABLE IF NOT EXISTS `store_var` (`var_id` varchar(20) NOT NULL,`prod_id` varchar(20) NOT NULL,`inv_id` varchar(20) NOT NULL,`img_id` varchar(20) NOT NULL,`title` varchar(50) NOT NULL,`sku` varchar(15) NOT NULL,`inv` INT(20) UNSIGNED NOT NULL, `storeid` BIGINT(32) NOT NULL, `warehouse_id` INT(10) NOT NULL, PRIMARY KEY (`var_id`));",
  storeVarSync:
    "INSERT IGNORE INTO `store_var` (`var_id`,`prod_id`,`inv_id`,`img_id`,`title`,`sku`,`inv`,`storeid`, `warehouse_id`) VALUES ",
  taxHarmCodes: "SELECT * FROM tax_numbers; SELECT * FROM harm_codes;",
  taxInsert: "INSERT INTO tax_numbers SET ?;",
  taxDelete: "DELETE FROM tax_numbers WHERE tax_id = ?;",
  typeAheadEpic:
    'SELECT `title`, `variant_sku` FROM `epic_vendor` WHERE `title` LIKE "%',
  typeAheadName:
    'SELECT `usr_fullname` FROM `user` WHERE `usr_fullname` LIKE "%',
  typeAheadProduct:
    'SELECT `pim_id` FROM `product_image` WHERE `pim_prd_id` = "%',
  upload1:
    "SELECT productsusa.title, productsusa.sku, productsusa.date, USA, Westacott_Rd FROM productsusa INNER JOIN productsuk ON productsusa.sku = productsuk.sku ORDER BY Westacott_Rd + 0 ASC, USA + 0 DESC;",
  upload2:
    "SELECT productsusa.title, productsusa.sku, productsusa.date, USA, Westacott_Rd FROM productsusa INNER JOIN productsuk ON productsusa.sku = productsuk.sku;",
  usersBase:
    "INSERT IGNORE INTO `users` (`username`, `password`, `roles`, `lastLogin`, `picture`, `email`, `token`, `tokenexpir`) VALUES ('david', '$2a$10$XdmCHF3iWWx5HCsw5k8n.On.6pJIi96ZB1hUEIsQugmgwKhe9alzi', '2', 'July 8th 2020, 12:24 pm', 'undefined-1576178124671.jpg', 'all@bodyaware.com', NULL, NULL);",
  usersCreate:
    "CREATE TABLE IF NOT EXISTS users (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `username` varchar(20) NOT NULL UNIQUE, `password` char(60) NOT NULL, `roles` char(1) NOT NULL, `lastLogin` varchar(30) NOT NULL,`picture` varchar(200) NOT NULL, `email` varchar(150) NOT NULL, `token` varchar(150) NULL, `tokenexpir` varchar(30) NULL, PRIMARY KEY(id));",
  userName: "SELECT * FROM users WHERE username = ?;",
  users:
    "SELECT `id`, `username`, `roles`, `lastLogin`, `picture` FROM `users`;",
  usersid: "DELETE FROM users WHERE id = ?;",
  warehouses: "SELECT * FROM warehouses;",
  warehouseBase:
    "INSERT IGNORE INTO `warehouses` (`name`, `shortname`) VALUES ('Orphan', 'ORPH');",
  warehouseCreate:
    "CREATE TABLE IF NOT EXISTS warehouses (id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL UNIQUE, shortname varchar(10), PRIMARY KEY(id));",
  warehouseDelete:
    "DELETE FROM warehouses WHERE id = ?; UPDATE stores SET warehouse = 1 WHERE warehouse = ?;",
  warehouseDeleteProducts: "DELETE FROM store_var WHERE warehouse_id = ?;",
  warehousesExclude: "SELECT * FROM warehouses WHERE `id` <> 1;",
  warehouseInsert: "INSERT INTO warehouses SET ?;",
  warehouseUpdate:
    "UPDATE warehouses SET name = ?, shortname = ? WHERE id = ?;",
  webhooksCreate:
    "CREATE TABLE IF NOT EXISTS webhooks (id INT NOT NULL AUTO_INCREMENT, signs varchar(100), storeid BIGINT(32), PRIMARY KEY(ID));",
  webhookSearch: "SELECT `signs` FROM webhooks WHERE `storeid` = ?",
};
