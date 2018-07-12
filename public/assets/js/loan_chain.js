$(function() {

	$('.error_form_income').hide();

	$("#bor_aadhaar_no_error_message").hide();
	$("#bor_pan_no_error_message").hide();
	$("#bor_email_error_message").hide();
	$("#bor_password_error_message").hide();
	$("#bor_re_password_error_message").hide();
	$("#bor_mobile_error_message").hide();

    $("#inv_aadhaar_no_error_message").hide();
    $("#inv_pan_no_error_message").hide();
    $("#inv_email_error_message").hide();
    $("#inv_password_error_message").hide();
    $("#inv_retype_password_error_message").hide();
    $("#inv_mobile_no_error_message").hide();

    var flg_error_bor_aadhaar_no = false;
	var flg_error_bor_pan_no = false;
	var flg_error_bor_email = false;
	var flg_error_bor_password = false;
	var flg_error_bor_re_password = false;
	var flg_error_bor_mobile = false;

	var flg_error_inv_aadhaar_no = false;
	var flg_error_inv_pan_no = false;
	var flg_error_inv_email = false;
	var flg_error_inv_password = false;
	var flg_error_inv_retype_password = false;
	var flg_error_inv_mobile_no = false;



	$('#borrower_aadhaar_no').on('input',function(e){
		check_aadhaar();
	});
	
	$('#borrower_pan_no').on('input',function(e){
		check_pan();
	});
	
	$('#borrower_email').on('input',function(e){
		check_email();
	});
	
	$('#borrower_password').on('input',function(e){
		check_password();
	});
	
	$('#borrower_re_password').on('input',function(e){
		check_retype_password();
	});
	
	$('#borrower_mobile').on('input',function(e){
		check_mobile();
	});
	
	$('#investor_aadhaar_no').on('input',function(e){
		inv_check_aadhaar();
	});

	$('#investor_pan_no').on('input',function(e){
		inv_check_pan();
	});

	$('#investor_email').on('input',function(e){
		inv_check_email();
	});
	
	$('#investor_password').on('input',function(e){
		inv_check_password();
	});
 
   $('#investor_retype_password').on('input',function(e){
		inv_check_retype_password();
	});

     $('#investor_mobile_no').on('input',function(e){
		inv_check_mobile();
	});

     $('#sel_emp_type').on('change',function(e){
     	display_emp_type($('#sel_emp_type').val());
     });
	 $('#marital_status_div').click(function(e){
     	set_maritial_status($("input[name='marital_status']:checked").val());
     });

     $('#loan_amt').on('input',function(e){
     	set_loan_amt($('#loan_amt').val());
     });

     $('#dob').on('input',function(e){
     	
     	set_dob($('#dob').val());
     });

     $('.annual_income').on('input',function(e){
     	disp_income($('.annual_income').val());
     });


		
	function check_aadhaar() {
	
		var aadhaar_length = $("#borrower_aadhaar_no").val().length;
		if(aadhaar_length < 12 || aadhaar_length > 12) {
			$("#bor_aadhaar_no_error_message").html("*Aadhaar number should be 12 digits.");
			$("#bor_aadhaar_no_error_message").show();
			flg_error_inv_aadhaar_no = true;
		} else {
			$("#bor_aadhaar_no_error_message").hide();
		}
	
	}

	function inv_check_aadhaar() {
	
		var inv_aadhaar_length = $("#investor_aadhaar_no").val().length;
		if(inv_aadhaar_length < 12 || inv_aadhaar_length > 12) {
			$("#inv_aadhaar_no_error_message").html("*Aadhaar number should be 12 digits.");
			$("#inv_aadhaar_no_error_message").show();
			flg_error_inv_aadhaar_no = true;
		} else {
			$("#inv_aadhaar_no_error_message").hide();
		}
	
	}

	
	function check_pan() {
	
		var aadhaar_length = $("#borrower_pan_no").val().length;
		
		if(aadhaar_length < 10 || aadhaar_length > 10) {
			$("#bor_pan_no_error_message").html("*PAN number should be 10 digits.");
			$("#bor_pan_no_error_message").show();
			flg_error_bor_pan_no = true;
		} else {
			$("#bor_pan_no_error_message").hide();
		}

		
	
	}

	function inv_check_pan() {
	
		var inv_aadhaar_length = $("#investor_pan_no").val().length;
		
		if(inv_aadhaar_length < 10 || inv_aadhaar_length > 10) {
			$("#inv_pan_no_error_message").html("*PAN number should be 10 digits.");
			$("#inv_pan_no_error_message").show();
			flg_error_inv_pan_no = true;
		} else {
			$("#inv_pan_no_error_message").hide();
		}
	
	}
	
	function check_email() {

		var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	
		if(pattern.test($("#borrower_email").val())) {
			$("#bor_email_error_message").hide();
		} else {
			$("#bor_email_error_message").html("Invalid email address");
			$("#bor_email_error_message").show();
			flg_error_bor_email = true;
		}

		
	}
	

	function inv_check_email() {

		var inv_pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	
		if(inv_pattern.test($("#investor_email").val())) {
			$("#inv_email_error_message").hide();
		} else {
			$("#inv_email_error_message").html("Invalid email address");
			$("#inv_email_error_message").show();
			flg_error_inv_email = true;
		}
	
	}
	function check_password() {

		var pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
	
		if(pattern.test($("#borrower_password").val())) {
			$("#bor_password_error_message").hide();
		} else {
			$("#bor_password_error_message").html("Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.");
			$("#bor_password_error_message").show();
			flg_error_bor_password = true;
		}

		
	
	}

	function inv_check_password() {

		var inv_pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
	
		if(inv_pattern.test($("#investor_password").val())) {
			$("#inv_password_error_message").hide();
		} else {
			$("#inv_password_error_message").html("Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.");
			$("#inv_password_error_message").show();
			flg_error_inv_password = true;
		}
	
	}
	
	function check_retype_password() {
	
		var password = $("#borrower_password").val();
		var retype_password = $("#borrower_re_password").val();
		
		if(password !=  retype_password) {
			$("#bor_re_password_error_message").html("Passwords does not match");
			$("#bor_re_password_error_message").show();
			flg_error_bor_re_password= true;
		} else {
			$("#bor_re_password_error_message").hide();
		}
}


	function inv_check_retype_password() {
	
		var inv_password = $("#investor_password").val();
		var inv_retype_password = $("#investor_retype_password").val();
		
		if(inv_password !=  inv_retype_password) {
			$("#inv_retype_password_error_message").html("Passwords does not match");
			$("#inv_retype_password_error_message").show();
			flg_error_inv_retype_password = true;
		} else {
			$("#inv_retype_password_error_message").hide();
		}
	
	}
	
	function check_mobile() {
	
		var aadhaar_length = $("#borrower_mobile").val().length;
		
		if(aadhaar_length < 10 || aadhaar_length > 10) {
			$("#bor_mobile_error_message").html("*Mobile number should be 10 digits.");
			$("#bor_mobile_error_message").show();
			flg_error_bor_mobile = true;
		} else {
			$("#bor_mobile_error_message").hide();
		}
	}
	
function inv_check_mobile() {
	
		var inv_mobile_length = $("#investor_mobile_no").val().length;
		if(inv_mobile_length < 10 || inv_mobile_length > 10) {
			$("#inv_mobile_no_error_message").html("*Mobile number should be 10 digits.");
			$("#inv_mobile_no_error_message").show();
			flg_error_inv_mobile_no= true;
		} else {
			$("#inv_mobile_no_error_message").hide();
		}
	
	}

	function display_emp_type(emp_type)
	{
		switch(emp_type)
		{
			case 'Salaried Employee':

				$("#annual_income").text('Annual Income');
				$("#profession_type").text('Profession Type');
				$("#profession_experience").text('Professional Experience');
				$("#turnover").text('Gross Annual Turnover');
				$("#sal_turnover").val('0');
				
			break;

			case 'Student':
				
		        $("#annual_income").text('Annual Income');
		        $("#profession_type").text('Student Graduation');
		        $("#profession_experience").text('Professional Experience');
		        $("#turnover").text('Gross Annual Turnover');
		        $("#sal_turnover").val('0');
		        
		       
			break;

			case 'Self-Employed':
				
		        $("#annual_income").text('Annual Income');
		        $("#profession_type").text('Profession Type');
		        $("#profession_experience").text('Professional Experience');
		        $("#turnover").text('Gross Annual Turnover');
		        $("#sal_turnover").val('');
		        
			break;

		}
	}

	function set_maritial_status(maritial)
	{
		switch(maritial)
		{
			case 'Single':
				$("#div_spouse_inc").val('0');
				console.log($("#div_spouse_inc").val());
		    break;
			case 'Married':
				$("#div_spouse_inc").val('');

				console.log($("#div_spouse_inc").val());
		    break;
		}

	}

	function set_loan_amt(loan_amt)
	{
		if (loan_amt>=25000 && loan_amt<=500000) {

			var disp_loan_amt = loan_amt%1000;
			console.log(disp_loan_amt);

     		if(disp_loan_amt==0)
     		{
     			$('#loan_amt_error_message').hide();
     		
     		}
     		else
     		{
     			$("#loan_amt_error_message").html("1.please enter loan amount between Rs.25,000 to 3,00,000.\n 2.Amount should be in multiples of 1000.");
     			$('#loan_amt_error_message').show();

     		}
		}
		else
     		{
     			$("#loan_amt_error_message").html("1.please enter loan amount between Rs.25,000 to 3,00,000.\n 2.Amount should be in multiples of 1000.");
     			$('#loan_amt_error_message').show();

     		}
	}

	function set_dob(dob)

	{
	    var now = new Date();
	    var past = new Date(dob);
	    var nowYear = now.getFullYear();
	    var pastYear = past.getFullYear();
	    var age = nowYear - pastYear;
		
		console.log(age);
		if(age>=21)
			{
				$('#dob_error_message').hide();
			}
		else
			{
				$('#dob_error_message').html("Age should be greater than 21.");
				$('#dob_error_message').show();
			}
	}

	function disp_income(sal_annual_income)
	{
		if(sal_annual_income>300000)
		{
			$('.error_form_income').hide();
		}
		else
		{
			$('.error_form_income').html("Income should be greater than 3,00,000");
			$('.error_form_income').show();
		}
	}

});