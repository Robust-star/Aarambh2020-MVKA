var express = require('express');
const https = require('https');
var router = express.Router();
const request=require('request');
// user db=======================
var User = require('../models/user');


// user db end====================

// home render===============
var d = new Date(); // Today!
d.setDate(d.getDate() - 1);
var baseurl = "https://api.covid19api.com/country/india?";
var to = "to="+d;
d.setDate(d.getDate() - 1);
var from = "from="+d+"&";
var urlfinal = baseurl + from + to;
var c
request(urlfinal, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		   c = JSON.parse(body);
		   router.get('/', function (req, res, next) {
			   return res.render('index1.ejs',{'death':c[(c.length)-1].Deaths,'confirmed':c[(c.length)-1].Confirmed,'recovered':c[(c.length)-1].Recovered,'active':c[(c.length)-1].Active});
		   });
	}
	  console.log(c[(c.length)-1].Confirmed);
  });



// 
// router.get('/', function (req, res, next) {
// 	return res.render('index1.ejs');
// });

//home render end =================

// data======================

//for login===========================
router.get('/register', function (req, res, next) {
	return res.render('index.ejs');
});

//end===================================
// doct===================
// router.get('/doct', function (req, res, next) {
// 	return res.render('doctor.ejs');
// });
//==================
//request================db data/////////

router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
							gender:personInfo.gender,
							special:personInfo.special,
							degree:personInfo.degree,
							mobile:personInfo.mobile
							

						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

//requets end ======================================

//login details=====================================

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});
//login end============================

// profile=========================

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('p1.ejs',);
		}
	});
});
// =================daksahab================
router.get('/doct', function (req, res, next) {
	console.log("doct");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data.mobile);
		console.log(data.gender);
		if(!data){
			res.redirect('/profile');
		}else{
			//console.log("found");
			return res.render('doctor.ejs', {"username":data.username,"email":data.email,"gender":data.gender,"mobile":data.mobile,"degree":data.degree,"special":data.special});
		}
	});
});



// profile=====================end======


// router.get('/profile/chat', function (req, res, next) {
// 	return res.render('chat.ejs');
// });

// logout================================


router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

// logut end================================

// forget  ==========================

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});
// forget end ================================================

// export==========================

module.exports = router;