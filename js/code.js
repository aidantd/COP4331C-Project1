const urlBase = 'http://cop4331-5.xyz/LAMPAPI';
const extension = 'php';

let userId  = 0;
let firstName = "";
let lastName = "";

let registerSlider = document.querySelector(".registerSlider");
let loginSlider = document.querySelector(".loginSlider");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
  
registerSlider.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});
  
loginSlider.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

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
					return;
				}
				html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
				html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
				for(let i = 0; i < jsonObject.results.length; i++) {
					html += "<tbody><tr><td id='firstName["  + i + "]'>" + jsonObject.results[i].firstName + 
					"</td><td id='lastName[" + i + "]'>" + jsonObject.results[i].lastName + 
					"</td><td id='phoneNumber[" + i + "]'>" + jsonObject.results[i].phone +
					"</td><td id='email[" + i + "]'>" + jsonObject.results[i].email + 
					"</td><td><button type='button' onclick='editContact(" + i + "," + jsonObject.results[i].id + ")'>Edit</button><button type='button' onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
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
					return;
				}
				html += "<section id=\"infoWindow\"><div class=\"container\"><table class=\"table\" id=\"contact-table\">"
				html += "<thread><tr><th>First Name</th><th>Last Name</th><th>Phone Number</th><th>Email</th><th>Actions</th></tr></thread>";
				for(let i = 0; i < jsonObject.results.length; i++) {
					html += "<tbody><tr><td id='firstName["  + i + "]'>" + jsonObject.results[i].firstName + 
					"</td><td id='lastName[" + i + "]'>" + jsonObject.results[i].lastName + 
					"</td><td id='phoneNumber[" + i + "]'>" + jsonObject.results[i].phone +
					"</td><td id='email[" + i + "]'>" + jsonObject.results[i].email + 
					"</td><td><button type='button' onclick='editContact(" + i + "," + jsonObject.results[i].id + ")'>Edit</button><button type='button' onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
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

function editContact(num, id) {
	let firstName = document.getElementById("firstName[" + num + "]").innerText;
	let lastName = document.getElementById("lastName[" + num + "]").innerText;
	let phoneNumber = document.getElementById("phoneNumber[" + num + "]").innerText;
	let email = document.getElementById("email[" + num + "]").innerText;

	let tmp = {firstName: firstName, lastName: lastName, phone: phoneNumber, email: email, id: id};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject= JSON.parse( xhr.responseText);
                document.getElementById("editStatus").innerHTML = "Successfully Edited Contact";
                return;
            }
        };
        xhr.send(jsonPayload);
    } 
    catch(err) {
        document.getElementById("deleteStatus").innerHTM = err.message;
    }
}