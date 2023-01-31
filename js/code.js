const urlBase = 'http://cop4331-5.xyz/LAMPAPI';
const extension = 'php';

let userId  = 0;
let firstName = "";
let lastName = "";

function register() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("newUserName").value;
    let password = document.getElementById("newPassword").value;

    document.getElementById("registerStatus").innerHTML = "";

	if(firstName === "" || lastName === "" || username === "" || password === "") {
		document.getElementById("registerStatus").innerHTML = "All fields are required";
		return;
	}

    let tmp = {firstName: firstName, lastName: lastName, login: username, password: password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;
    console.log(tmp);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8" );

    try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject= JSON.parse( xhr.responseText);
                document.getElementById("registerStatus").innerHTML = "Successfully Registered Please Login";
                return;
            }
        };
        xhr.send(jsonPayload);
    } 
    catch(err) {
        document.getElementById("registerStatus").innerHTM = err.message;
    }
}

function login() {
    userId = 0;
    let username = document.getElementById("usernameLogin").value;
    let password = document.getElementById("passwordLogin").value;

    let tmp = {login: username, password: password};
    let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse( xhr.responseText );
				userId  = jsonObject.id;
		
				if(userId < 1) {		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "UserId =" + userId  + ",firstName=" + firstName + ",lastName=" + lastName +";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if(tokens[0] == "firstName") {
		    firstName = tokens[1];
		}
		else if(tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if(tokens[0] == "UserId") {
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if( userId < 0 ) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("loggedInUser").innerHTML = firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showAllContacts() {
	let search = "";
	let tmp = {userID: userId, search: search};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				let html = "";
				if(jsonObject.id == 0) {
					html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
					html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
					html += "</table></div></section>";
					document.getElementById("allContactInfo").innerHTML = html;
					return;
				}
				html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
				html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
				for(let i = 0; i < jsonObject.results.length; i++) {
					html += "<tbody><tr><td id='firstName["  + i + "]'>" + jsonObject.results[i].firstName + 
					"</td><td id='lastName[" + i + "]'>" + jsonObject.results[i].lastName + 
					"</td><td id='phoneNumber[" + i + "]'>" + jsonObject.results[i].phone +
					"</td><td id='email[" + i + "]'>" + jsonObject.results[i].email + 
					"</td><td>" +
					"<button type='button' id='editButton[" + i + "] onclick='editContact(" + i + ")'>Edit</button>" + 
					"<button type='button' id='saveButton[" + i + "] onclick='saveContact(" + i + "," + jsonObject.results[i].id + ")' style='display: none'>Save</button>" +
					"<button type='button' id='deleteButton[" + i + "] onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
				}
				html += "</table></div></section>";
				document.getElementById("allContactInfo").innerHTML = html;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("allContactInfo").innerHTML = err.message;
	}
}

function searchContact() {
	let search = document.getElementById("searchUser").value;
	let tmp = {userID: userId, search: search};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				let html = "";
				if(jsonObject.id == 0) {
					document.getElementById("searchContactInfo").innerHTML = "No Contacts";
					html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
					html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
					html += "</table></div></section>";
					document.getElementById("allContactInfo").innerHTML = html;
					return;
				}
				html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
				html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
				for(let i = 0; i < jsonObject.results.length; i++) {
					html += "<tbody><tr><td id='firstName["  + i + "]'>" + jsonObject.results[i].firstName + 
					"</td><td id='lastName[" + i + "]'>" + jsonObject.results[i].lastName + 
					"</td><td id='phoneNumber[" + i + "]'>" + jsonObject.results[i].phone +
					"</td><td id='email[" + i + "]'>" + jsonObject.results[i].email + 
					"</td><td><button type='button' id='editButton[" + i + "] onclick='editContact(" + i + ")'>Edit</button>" + 
					"<button type='button' id='saveButton[" + i + "] onclick='saveContact(" + i + "," + jsonObject.results[i].id + ")' style='display: none'>Save</button>" +
					"<button type='button' id='deleteButton[" + i + "] onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
				}
				html += "</table></div></section>";
				document.getElementById("allContactInfo").innerHTML = html;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("searchContactInfo").innerHTML = err.message;
	}
}

function addContact() {
	let firstNameAdd = document.getElementById("contact-info-name-first").value;
	let lastNameAdd = document.getElementById("contact-info-name-last").value;
	let phoneNumberAdd = document.getElementById("contact-info-phone").value;
	let emailAdd = document.getElementById("contact-info-email").value;

	let tmp = {firstName: firstNameAdd, lastName: lastNameAdd, phone: phoneNumberAdd, email: emailAdd, userID: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject= JSON.parse( xhr.responseText);
                document.getElementById("contactAddStatus").innerHTML = "Successfully Added Contact";
                return;
            }
        };
        xhr.send(jsonPayload);
    } 
    catch(err) {
        document.getElementById("contactAddStatus").innerHTM = err.message;
    }
}

function deleteContact(num) {
	let firstName = document.getElementById("firstName[" + num + "]").innerText;
	let lastName = document.getElementById("lastName[" + num + "]").innerText;

	let tmp = {firstName: firstName, lastName: lastName,userID: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject= JSON.parse( xhr.responseText);
                document.getElementById("deleteStatus").innerHTML = "Successfully Deleted Contact";
                return;
            }
        };
        xhr.send(jsonPayload);
    } 
    catch(err) {
        document.getElementById("deleteStatus").innerHTM = err.message;
    }
}

function editContact(num) {
    document.getElementById("editButton[" + num + "]").style.display = "none";
    document.getElementById("saveButton[" + num + "]").style.display = "inline-block";

    var firstNameVal = document.getElementById("firstName[" + num + "]");
    var lastNameVal = document.getElementById("lastName[" + num + "]");
    var emailVal = document.getElementById("phoneNumber[" + num + "]");
    var phoneVal = document.getElementById("email[" + num + "]");

    var firstNameData = firstNameVal.innerText;
    var lastNameData = lastNameVal.innerText;
    var emailData = emailVal.innerText;
    var phoneData = phoneVal.innerText;

    firstNameVal.innerHTML = "<input type='text' id='firstNameData[" + num + "]' value='" + firstNameData + "'>";
    lastNameVal.innerHTML = "<input type='text' id='lastNameData[" + num + "]' value='" + lastNameData + "'>";
    emailVal.innerHTML = "<input type='text' id='emailData[" + num + "]' value='" + emailData + "'>";
    phoneVal.innerHTML = "<input type='text' id='phoneData[" + num + "]' value='" + phoneData + "'>"
}

function saveContact(num, id) {
    var firstNameData = document.getElementById("firstNameData[" + num + "]").value;
    var lastNameData = document.getElementById("lastNameData[" + num + "]").value;
    var emailData = document.getElementById("emailData[" + num + "]").value;
    var phoneData = document.getElementById("phoneData[" + num + "]").value;

    document.getElementById("firstName[" + num + "]").innerHTML = firstNameData;
    document.getElementById("lastName[" + num + "]").innerHTML = lastNameData;
    document.getElementById("phoneNumber[" + num + "]").innerHTML = emailData;
    document.getElementById("email[" + num + "]").innerHTML = phoneData;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {firstName: firstNameData, lastName: lastNameData, phone: phoneData, email: emailData, id: id};

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}