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
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

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
	document.cookie = "UserId =" + userId  + ";expires=" + date.toGMTString();
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
		else if(tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if( userId < 0 ) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function getContactInfo() {
	let tmp = {userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/GetContactInfo.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				for(let i = 0; i < jsonObject.results.length; i++) {
					html += "<tr><td id='firstName["  + i + "]'>" + jsonObject.results[i].firstName + "</td><td id='lastName[" + i + "]'>" + jsonObject.results[i].lastName + "</td><td id='phoneNumber[" + i + "]'>" + jsonObject.results[i].phoneNumber + "</td><td id='email[" + i + "]'>" + jsonObject.results[i].email + "</td></tr>";
				}
				document.getElementById("contactInfo").innerHTML = html;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("contactInfo").innerHTML = err.message;
	}
}