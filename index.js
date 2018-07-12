var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var mysql = require('mysql');
Eos = require('eosjs')
const ecc = require('eosjs-ecc')
var ip ='loanchain.dltgeeks.io';
var port='3888';
var baseurl= 'http://'+ip+':'+port;
console.log('baseurl:'+baseurl);


// Default configuration (additional options below)
config = {
  chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
  keyProvider: ['5Kk6Q4L4XR9pLEVwAEA1copNRXUXb2ivs2jg31qfmF54DeJYAeg','5K5Yh3EV8yKX8eU9yc3FJHoZVYfHseaDy9WZkDiN38C68JnZZVD','5Hpi4jXWt9tvX3pgoa6Lq7VRyXmHWAjJqQif9ipoy4LEfehA1Pa','5JebU9LKJDQ48Zg6omsQvVAKhGc7j1AE9YwMwgeG7cRvXALNoCY'], // WIF string or array of keys..
  httpEndpoint: 'http://195.29.45.119:80',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

eos = Eos(config)

//Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'p2p'
};

var sessionStore = new MySQLStore(options);


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "p2p"
});
con.connect(function(err) {
  if (err) throw err;
});


app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use(session({
  secret : '1234gcxdfy754edcNOD#',
  resave : false,
  store : sessionStore,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
})

//function to make a unique 12 character username for borrower and lender to make a new account in blockchian
function makeid() {
var text = "";
var possible = "abcdefghijklmnopqrstuvwxyz12345";

for (var i = 0; i < 12; i++)
text += possible.charAt(Math.floor(Math.random() * possible.length));

return text;
}

//function to get age from date of birth
function getAge(dateString) {
var today = new Date();
var birthDate = new Date(dateString);
var age = today.getFullYear() - birthDate.getFullYear();
var m = today.getMonth() - birthDate.getMonth();
if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	age--;
   }
return age;
}

//check for invalid age in borrower's personal details and lender form
app.post('/invalid_age', function(req, res){
   res.write('age should more than or equal to 21 to register')
});

//check for invalid income in borrower's personal details
app.post('/invalid_income', function(req, res){
   res.write('income should more than 3 lakh per annum')
});

//homepage of Loanchain 
app.get('/', function(req, res){
   res.render('register',{
		baseurl:baseurl
			  });
});

app.get('/logout', (req, res, next) => {
   req.logout()
   req.session.destroy(() => {
       res.clearCookie('connect.sid')
       res.redirect('/')
   })
})
//
app.get('/lender_form', function(req, res){
   res.render('investor_form',{
			  baseurl:baseurl
			  });
});
app.get('/borrower_login', function(req, res){
   res.render('borrower_login',{
			  baseurl:baseurl
			  });
});

app.get('/borrower_form', function(req, res){
   res.render('borrower_form',{
			  baseurl:baseurl});
});

app.get('/lender_login', function(req, res){
   res.render('lender_login',{
			  baseurl:baseurl});
});

app.get('/personal_details', authenticationMiddleware(), function(req, res){
	
	res.render('personal_details', { id : req.query.id,
								    baseurl:baseurl
								   });
});

app.get('/borrower_home', authenticationMiddleware(), function(req, res){
	
	var sql = "SELECT * FROM  borrower_login where ID ='"+req.query.id+"' "; 
    con.query(sql, function (err, result) {
	var sql = "SELECT * FROM  lendings where borrowerID ='"+req.query.id+"' "; 
    con.query(sql, function (err1, result1) {
   if (result[0].verified){
     if(result1.length){
		    console.log('verified and has lending')
			res.render('homepage_borrower',{
				url                   : baseurl+"/document_verification_b?id=" +req.query.id+"",
				action1               : "create_lending?id="+req.query.id,
				document_verification :"display:none;",
				loan_application      :"display:none;",
				current_loan          :"display:block;",
				amount                : result[0].amount,
				id                    : req.query.id,
				tenure                : result[0].tenure,
				purpose               : result[0].purpose,
				description           : result[0].description,
				dob                   : result[0].dob,
				city                  : result[0].city,
				job                   : result[0].job,
				exp                   : result[0].exp,
				pincode               : result[0].pincode,
				prof                  : result[0].prof,
				turnover              : result[0].turnover,
				profit                : result[0].profit,
				residence             : result[0].residence,
				sp_inc                : result[0].sp_inc,
				other_inc             : result[0].other_inc,
				interest	          : result[0].interest,
				rows                  : result,
				net_borrowed          : result1[0].net_borrowed,
				progress              : "width:" +(result1[0].net_borrowed-result1[0].amount_left)/result1[0].net_borrowed*100+"%",
				baseurl               : baseurl
			});
   }else{    console.log('verified but no lending')
			res.render('homepage_borrower',{
				url                   : baseurl+"/document_verification_b?id=" +req.query.id+"",
				action1               : "create_lending?id="+req.query.id,
				document_verification :"display:none;",
				loan_application      :"display:block;",
				current_loan          :"display:none;",
				amount                : result[0].amount,
				id                    : req.query.id,
				tenure                : result[0].tenure,
				purpose               : result[0].purpose,
				description           : result[0].description,
				dob                   : result[0].dob,
				city                  : result[0].city,
				job                   : result[0].job,
				exp                   : result[0].exp,
				pincode               : result[0].pincode,
				prof                  : result[0].prof,
				turnover              : result[0].turnover,
				profit                : result[0].profit,
				residence             : result[0].residence,
				sp_inc                : result[0].sp_inc,
				other_inc             : result[0].other_inc,
				interest	          : result[0].interest,
				baseurl               :baseurl
			});
 }
}else{      console.log('not verified')
			res.render('homepage_borrower',{
				url                   : baseurl+"/document_verification_b?id=" +req.query.id+"",
				action1               : "create_lending?id="+req.query.id,
				document_verification :"display:block;",
				loan_application      :"display:none;",
				current_loan          :"display:none;",
				amount                : result[0].amount,
				id                    : req.query.id,
				tenure                : result[0].tenure,
				purpose               : result[0].purpose,
				description           : result[0].description,
				dob                   : result[0].dob,
				city                  : result[0].city,
				job                   : result[0].job,
				exp                   : result[0].exp,
				pincode               : result[0].pincode,
				prof                  : result[0].prof,
				turnover              : result[0].turnover,
				profit                : result[0].profit,
				residence             : result[0].residence,
				sp_inc                : result[0].sp_inc,
				other_inc             : result[0].other_inc,
				interest	          : result[0].interest,
				baseurl               :baseurl
			});
	        
}
});
});
});
app.post('/check_eligibility', authenticationMiddleware(), function(req, res){
	
//code to check the risk category and probability of getting a loan
});
app.get('/document_verification_b', authenticationMiddleware(), function(req, res){
    var sql = "SELECT * FROM borrower_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err1, result1) {
    if (err1) throw err1;
		
		eos.transaction(
				  {
					// ...headers,
					actions: [
					  {
						account: 'loanchain',
						name: 'updateb',
						authorization: [{
						  actor: 'adminb',
						  permission: 'active'
						}],
						data: {
						  borrower_n: result1[0].uname,
						  cibil_score: 700,
						  age: getAge (result1[0].dob),
						  income: result1[0].profit,
						  verified:1
						}
					  }
					]
				  }
		)
   });
    var sql = "UPDATE borrower_login SET verified= 1 WHERE ID ='"+req.query.id+"' "; 
    con.query(sql, function (err1, result1) {
    if (err1) throw err1;
     });	
	res.redirect('/borrower_home?id='+ req.query.id);
});
app.get('/create_lending', authenticationMiddleware(), function(req, res){
	var sql = "SELECT * FROM borrower_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err1, result1) {
    if (err1) throw err1;
	
	var sql = "INSERT INTO lendings (borrowerID, borrower_n,net_borrowed,amount_left, maturity, interest, emi) VALUES ('"+req.query.id+"','"+result1[0].uname+"', '"+ req.query.amount +"', '"+ req.query.amount +"','"+ req.query.tenure +"','"+ req.query.interest +"', '"+ req.query.emi +"'  )";	
    con.query(sql, function (err, result) {
    if (err) throw err
	
	});
});
		
  res.redirect('/borrower_home?id='+ req.query.id);
});

app.get('/lender_home', authenticationMiddleware(), function(req, res){
	var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
  con.query(sql, function (err, result) {
    if (err) throw err;
	res.render('homepage_lender',{
		url     :baseurl+"/document_verification_l?id="+req.query.id+"",
		url1    :baseurl+"/edit_profile?id="+req.query.id+" ",
		action1 :"update_balance",
		url3 : baseurl+"/active_borrower?id="+req.query.id+" ",
		id      : req.query.id,
		fname   : result[0].fname,
		email   : result[0].email,
		aadhar  : result[0].aadhar,
		pancard : result[0].pancard,
		balance : result[0].balance,
		baseurl :baseurl
	});
});
});

app.get('/document_verification_l', authenticationMiddleware(), function(req, res){
	var sql = "SELECT * FROM lender_login WHERE ID ='"+req.query.id+"'"; 
    con.query(sql, function (err, result) {
    if (err) throw err;
		console.log(result[0].balance)
		console.log(result[0].lending_score)
		console.log(result[0].uname)
		console.log(req.query.id)
		
		eos.transaction(
				  {
					// ...headers,
					actions: [
					  {
						account: 'loanchain',
						name: 'updatel',
						authorization: [{
						  actor: 'adminl',
						  permission: 'active'
						}],
						data: {
						  lender_n: result[0].uname,
						  balance: result[0].balance,
						  lending_score: result[0].lending_score,
						  age: getAge (result[0].dob),
						  verified:1
						}
					  }
					]
				  }
		)
		});
        var sql = "UPDATE lender_login SET verified=1 WHERE ID = '"+req.query.id+"' " ; 
        con.query(sql, function (err1, result1) {
        if (err1) throw err1;
	    });
   res.redirect('/lender_home?id='+req.query.id.trim());

	
	
});

app.get('/edit_profile', authenticationMiddleware(), function(req, res){
	
	var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
  con.query(sql, function (err, result) {
    if (err) throw err;
	res.render('edit_profile',{
		fname   : result[0].fname,
		mname   : result[0].mname,
		lname   : result[0].lname,
		aadhar  : result[0].aadhar,
		pancard : result[0].pancard,
		dob     : result[0].dob,
		pincode : result[0].pincode,
		city    : result[0].city,
		email   : result[0].email,
		password: result[0].password,
		contact	: result[0].contact,
		id 		: req.query.id.trim(),
		baseurl :baseurl
	});
});
});
app.post('/edit_lender', authenticationMiddleware(), function(req, res){
	
	var sql = "UPDATE lender_login SET fname= '"+req.body.fname+"', mname= '"+req.body.mname+"',lname='"+req.body.lname+"', gender='"+req.body.gender+"', aadhar='"+req.body.aadhar+"',pancard='"+req.body.pancard+"', dob='"+req.body.dob+"', pincode='"+req.body.pincode+"', city='"+req.body.city+"',password= '"+req.body.password+"', contact= '"+req.body.contact+"' WHERE ID = '"+req.body.id+"' "; 
  con.query(sql, function (err, result) {
    if (err) throw err;
	console.log(result)
	console.log(req.query.id)
});
	res.redirect('/lender_login');
});
app.get('/update_balance', authenticationMiddleware(), function(req, res){
	
	var sql = "UPDATE lender_login SET balance= balance + '"+req.query.balance+"' WHERE ID = '"+req.query.id+"' "; 
  con.query(sql, function (err1, result1) {
    if (err1) throw err1;
	console.log(result1)
    });
	  var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err, result) {
    if (err) throw err;
	eos.transaction(
				  {
					// ...headers,
					actions: [
					  {
						account: 'loanchain',
						name: 'updatel',
						authorization: [{
						  actor: 'adminl',
						  permission: 'active'
						}],
						data: {
						  lender_n: result[0].uname,
		                  balance: result[0].balance,
                          lending_score: result[0].lending_score,
		                  age: getAge (result[0].dob),
						  verified:1
						}
					  }
					]
				  }
		)

});
	res.redirect('/lender_home?id='+ req.query.id.trim());
});
app.get('/active_borrower_logout', function(req, res){
	 var constr = '';
	 var obj;
	 var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err, result) {
    if (err) throw err;
	var sql = "SELECT * FROM lendings ln join borrower_login pd on ln.borrowerID = pd.ID"; 
    con.query(sql, function (err1, rows, fields) {
    if (err1) throw err1;
		res.render('active_borrower',{
		rows   : rows,
		//action2:"create_lendinfo",
		display2  : 'display:block;',
		display1  : 'display:none;',
		homeurl   : '/lender_home?id='+ req.query.id,
		id        : req.query.id,
	    //progress  : "width:" +(rows[0].net_borrowed-rows[0].amount_left)/rows[0].net_borrowed*100+"%",
		baseurl   :baseurl
	   }); 
	
});
});
});
app.get('/active_borrower', authenticationMiddleware1(), function(req, res){
	 var constr = '';
	 var obj;
	 var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err, result) {
    if (err) throw err;
	var sql = "SELECT * FROM lendings ln join borrower_login pd on ln.borrowerID = pd.ID"; 
    con.query(sql, function (err1, rows, fields) {
    if (err1) throw err1;
    if(req.query.id>0){
		res.render('active_borrower',{
			rows      : rows,
			display2  : 'display:none;',
			display1  : 'display:block;',
			//action2:"create_lendinfo",
			homeurl   : '/lender_home?id='+ req.query.id,
			id        : req.query.id,
			//progress  : "width:" +(rows[0].net_borrowed-rows[0].amount_left)/rows[0].net_borrowed*100+"%",
			baseurl   :baseurl
	}); 
	}else{
		res.render('active_borrower',{
		rows   : rows,
		//action2:"create_lendinfo",
		display2  : 'display:block;',
		display1  : 'display:none;',
		homeurl   : '/lender_home?id='+ req.query.id,
		id        : req.query.id,
	    //progress  : "width:" +(rows[0].net_borrowed-rows[0].amount_left)/rows[0].net_borrowed*100+"%",
		baseurl   :baseurl
	   }); 
	}
});
});
});
app.get('/create_lendinfo', authenticationMiddleware(), function(req, res){
	
	 var sql = "SELECT * FROM lender_login WHERE ID = '"+req.query.id+"' "; 
    con.query(sql, function (err, result) {
    if (err) throw err;
	 var sql = "SELECT * FROM lendings WHERE borrowerID = '"+req.query.borrowerID+"' "; 
    con.query(sql, function (err1, result1) {
    if (err1) throw err1;
	var sql = "SELECT * FROM lendinfo WHERE lenderID = '"+req.query.id+"' AND borrowerID = '"+req.query.borrowerID+"'"; 
    con.query(sql, function (err6, result6) {
	console.log(result);
	if(((req.query.principal <= result1[0].net_borrowed/5 && req.query.principal<=20000)&&(req.query.principal<= result1[0].amount_left && req.query.principal <= result[0].balance))&&(!result6.length&&req.query.principal)){
				var sql = "INSERT INTO lendinfo (borrowerID, lenderID, borrower_n, lender_n, principal, months_left, penalty) VALUES ('"+req.query.borrowerID+"','"+req.query.id+"','"+result1[0].borrower_n+"','"+result[0].uname+"','"+req.query.principal+"','"+result1[0].maturity+"','0')";
				con.query(sql, function (err4, result4) {
				if (err4) throw err4; 
				 });	

			  var sql = "UPDATE lender_login SET balance= balance - '"+req.query.principal+"' WHERE ID = '"+req.query.id+"' "; 
			  con.query(sql, function (err2, result2) {
				if (err2) throw err2;
				console.log(result2)
				});
			  var sql = "UPDATE lendings SET amount_left= amount_left - '"+req.query.principal+"' WHERE borrowerID = '"+req.query.borrowerID+"' "; 
			  con.query(sql, function (err3, result3) {
				if (err3) throw err3;
				console.log(result3)
				});
	            
	           if(result1[0].amount_left==0){
			  		 
				     eos.transaction(
					 {
					   // ...headers,
					   actions: [
						 {
						   account: 'loanchain',
						   name: 'createlen',
						   authorization: [{
							 actor: 'adminlen',
							 permission: 'active'
						   }],
						   data: {
							 borrower_n: result1[0].borrower_n,
							 net_borrowed: result1[0].net_borrowed,
							 maturity: result1[0].maturity,
							 interest: result1[0].interest,
							  emi: (req.query.principal * result1[0].interest * (1 + result1[0].interest) ^ result1[0].maturity) / ((1 + result1[0].interest) ^ result1[0].maturity - 1)
						   }
						 }
					   ]
					 }
					)
				   
				    var sql = "SELECT * FROM lendinfo WHERE borrowerID = '"+req.query.borrowerID+"' "; 
   			   	   con.query(sql, function (err6, result6) {
   				   if (err6) throw err6;
				  
							   for(i=0; i<result6.length;i++){
													 eos.transaction(
													 {
													   // ...headers,
													   actions: [
														 {
														   account: 'loanchain',
														   name: 'createinfo',
														   authorization: [{
															 actor: 'adminlen',
															 permission: 'active'
															 },{
															 actor: 'adminl',
															 permission: 'active'
															 },{
															 actor: 'adminb',
															 permission: 'active'
															 }],
														   data: {
															 borrower_n: result1[0].borrower_n,
															 lender_n: result6[i].lender_n,
															 principal: req.query.principal
														   }
														 }
													   ]
													 }
													)
							   }
		
			       });
			   }
		res.send(result)
		res.end();
	}
  
		else{
		res.send('fail');
		res.end();}
   
});  //res.redirect('/active_borrower?id='+ req.query.id);
});
});
});
		


//when clicked signup for lender
app.post('/lender_signup', function(req, res) {
 
 var account_name = makeid()
 if (getAge(req.body.dob) < 21){
     res.redirect("/invalid_age")
     res.end()
     
   }else{


ecc.randomKey().then(privateKey => {
console.log('Private Key:\t', privateKey) // wif
console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...
return (privateKey)

}).then( function(privateKey){

eos.transaction(tr => {
  tr.newaccount({
    creator: 'loanchain',
    name: account_name,
    owner: ecc.privateToPublic(privateKey),
    active: ecc.privateToPublic(privateKey)
  })

  tr.buyrambytes({
    payer: 'loanchain',
    receiver: account_name,
    bytes: 8192
  })

  tr.delegatebw({
    from: 'loanchain',
    receiver: account_name,
    stake_net_quantity: '10.0000 EOS',
    stake_cpu_quantity: '10.0000 EOS',
    transfer: 0
  })
  })
    

	con.query("INSERT INTO lender_login (fname, mname, lname, gender, aadhar, pancard, dob, pincode, city, email, password, contact, uname, prikey) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.fname,req.body.mname,req.body.lname,req.body.gender,req.body.aadhar,req.body.pancard,req.body.dob,req.body.pincode,req.body.city,req.body.email,req.body.password,req.body.contact,account_name,privateKey], function (err, result) {
	if (err) throw err;
	

     eos.transaction(
  {
    // ...headers,
    actions: [
      {
        account: 'loanchain',
        name: 'createl',
        authorization: [{
          actor: 'adminl',
          permission: 'active'
        }],
        data: {
          lender_n: account_name,
          age: getAge (req.body.dob)
        }
      }
      ]
      })


        const user_id = result.insertId;
        
        req.login(user_id, function(err2){
          res.redirect('/lender_home?id=' +result.insertId);
        })
        
     
  });

})
	
 }  
	  
});

/*function signup(req, res, next) {
     var sql = "INSERT INTO borrower_login (fname,mname, lname, gender, aadhar, pancard, email, password, contact) VALUES ('"+req.body.fname+"','"+req.body.mname+"','"+req.body.lname+"','"+req.body.gender+"','"+req.body.aadhar+"','"+req.body.pancard+"','"+req.body.email+"','"+req.body.password+"','"+req.body.contact+"')";
	con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted in borrower_login table, ID: " + result.insertId);
     })
    return next();  
}
function personal_details(req, res) {
    res.render('personal_details');
}
app.post('/borrower_signup', signup, personal_details);**/

//when clicked signup for borrower

app.post('/borrower_signup', function(req, res) {
	 
 var account_name = makeid()
 
ecc.randomKey().then(privateKey => {
console.log('Private Key:\t', privateKey) // wif
console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...
return (privateKey)

}).then( function(privateKey){

eos.transaction(tr => {
  tr.newaccount({
    creator: 'loanchain',
    name: account_name,
    owner: ecc.privateToPublic(privateKey),
    active: ecc.privateToPublic(privateKey)
  })

  tr.buyrambytes({
    payer: 'loanchain',
    receiver: account_name,
    bytes: 8192
  })

  tr.delegatebw({
    from: 'loanchain',
    receiver: account_name,
    stake_net_quantity: '10.0000 EOS',
    stake_cpu_quantity: '10.0000 EOS',
    transfer: 0
  })
  })
    
	
	//res.sendFile('/home/developer/Documents/LoanChain/public/personal_details.html')
	con.query("INSERT INTO borrower_login (fname,mname, lname, gender, aadhar, pancard, email, password, contact,uname, prikey) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [req.body.fname,req.body.mname,req.body.lname,req.body.gender,req.body.aadhar,req.body.pancard,req.body.email,req.body.password,req.body.contact,account_name,privateKey], function (err, result) {
    if (err) throw err;

    const user_id = result.insertId;
    
    req.login(user_id, function(err2){
      res.redirect('/personal_details?id=' +result.insertId);
    })


    });
});
});

app.post('/homepage_borrower', authenticationMiddleware(), function(req, res) {
	
	if (getAge(req.body.dob) < 21){
     res.redirect("/invalid_age")
     res.end()
     
   }else if(req.body.profit < 300000){
   res.redirect("/invalid_income")
	   res.end();
   
   }
	else	
	{
	console.log(req.body.id)
 var sql1="SELECT uname FROM borrower_login WHERE ID= '"+req.body.id+"'";
 con.query(sql1, function (err, result) {
    if (err) throw err;
	 var uname = result[0].uname;
	 
	 console.log(parseInt(req.body.profit))
	 console.log(uname)

     eos.transaction(
  {
    // ...headers,
    actions: [
      {
        account: 'loanchain',
        name: 'createb',
        authorization: [{
          actor: 'adminb',
          permission: 'active'
        }],
        data: {
          borrower_n: uname,
          age: getAge(req.body.dob),
          income: parseInt(req.body.profit)
        }
      }
    ]
  } 
)
  });
		
	//res.sendFile('/home/developer/Documents/LoanChain/public/personal_details.html')
  var sql = "UPDATE borrower_login SET amount='"+req.body.amount+"', tenure='"+req.body.tenure+"' ,purpose='"+req.body.purpose+"', description='"+req.body.description+"', married='"+req.body.married+"', dob='"+req.body.dob+"', pincode='"+req.body.pincode+"', city='"+req.body.city+"', job='"+req.body.job+"', exp='"+req.body.exp+"', prof='"+req.body.prof+"', turnover='"+req.body.turnover+"', profit='"+req.body.profit+"', residence='"+req.body.residence+"', sp_inc='"+req.body.sp_inc+"', other_inc='"+req.body.other_inc+"', loan='"+req.body.loan+"', credcard='"+req.body.credcard+"' WHERE ID ='"+req.body.id+"'";
	con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted in borrower_login table, ID: " + req.body.id);

	 res.redirect('/borrower_home?id='+ req.body.id)
     //res.write('Congratulation "' + req.body.fname+'" you are now registered at p2p platform.\n');
	 res.end()
  });
}

 });


//when clicked login for lender
app.post('/lender_valid', function(req, res) {
  var sql = "SELECT id,email, password FROM lender_login WHERE email = '"+req.body.email+"'  AND  password= '"+req.body.password+"' "; 
  con.query(sql, function (err, result) {

    if (!result.length){
		res.send('fail');
	} else{
		const user_id = result[0].id;
		req.login(result[0].id, function(err2){
      //res.redirect('/personal_details?id=' +result.insertId);
    })
	res.send(result);
    //res.redirect('/lender_home?id='+ result[0].id);
	 res.end()
	}
  });
});
	
//when clicked login for borrower
app.post('/borrower_valid', function(req, res) {
  var sql = "SELECT id, email, password FROM borrower_login WHERE email = '"+req.body.email+"'  AND  password= '"+req.body.password+"'"; 
  con.query(sql, function (err, result) {
  	const user_id = result[0].id;

    if (!result.length){
		res.send('fail');
	} else{
		req.login(result[0].id, function(err2){
      //res.redirect('/personal_details?id=' +result.insertId);
       })
	res.send(result);
    //res.redirect('/lender_home?id='+ result[0].id);
	 res.end()
	}
  });
});

passport.serializeUser(function(user_id, done){
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done){
  done(null, user_id);
});

function authenticationMiddleware () {  
  return (req, res, next) => {

      if (req.isAuthenticated()) return next();
      res.redirect('/')
  }
}
function authenticationMiddleware1 () {  
  return (req, res, next) => {
      if (req.isAuthenticated()) return next();
      res.redirect('/active_borrower_logout')
  }
}
	


app.listen(parseInt(port));

