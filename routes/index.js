var express = require('express');
var router = express.Router();

// home render===============

router.get('/', function (req, res, next) {
	return res.render('index1.ejs');
});

//home render end =================


// export==========================

module.exports = router;