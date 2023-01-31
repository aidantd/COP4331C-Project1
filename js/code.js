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
					"</td><td><button type='button' onclick='editContact(" + i + ")'>Edit</button><button type='button' onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
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
					"</td><td><button type='button' onclick='editContact(" + i + ")'>Edit</button><button type='button' onclick='deleteContact(" + i + ")'>Delete</button></td></tr></tbody>";
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
	let phoneNumberAdd = document.getElementById("contact-info-email").value;
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

function deleteContact(i) {
	let firstName = document.getElementById("firstName[" + i + "]").value;
	let lastName = document.getElementById("lastName[" + i + "]").value;
	let phoneNumber = document.getElementById("phoneNumber[" + i + "]").value;
	let email = document.getElementById("email[" + i + "]").value;

	let tmp = {firstName: firstName, lastName: lastName, phone: phoneNumber, email: email};
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

function editContact(i) {
	let firstName = document.getElementById("firstName[" + i + "]").value;
	let lastName = document.getElementById("lastName[" + i + "]").value;
	let phoneNumber = document.getElementById("phoneNumber[" + i + "]").value;
	let email = document.getElementById("email[" + i + "]").value;

	let tmp = {firstName: firstName, lastName: lastName, phone: phoneNumber, email: email};
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


// function edit_row(id) {
//     document.getElementById("editContact" + id).style.display = "none";
//     document.getElementById("saveContact" + id).style.display = "inline-block";

// 	var firstNameVal = document.getElementById("first_Name" + id);
//     var lastNameVal = document.getElementById("last_Name" + id);
//     var emailVal = document.getElementById("email" + id);
//     var phoneVal = document.getElementById("phone" + id);

//     var firstNameInner = firstNameVal.innerText;
//     var lastNameInner = lastNameVal.innerText;
//     var emailInner = emailVal.innerText;
//     var phoneInner = phoneVal.innerText;

//     firstNameVal.innerHTML = "<input type='text' id='firstNameInner" + id + "' value='" + firstNameInner + "'>";
//     lastNameVal.innerHTML = "<input type='text' id='lastNameInner" + id + "' value='" + lastNameInner + "'>";
//     emailVal.innerHTML = "<input type='text' id='emailInner" + id + "' value='" + emailInner + "'>";
//     phoneVal.innerHTML = "<input type='text' id='phoneInner" + id + "' value='" + phoneInner + "'>"
// }

// function save_row(id) {
//     var firstNameVal = document.getElementById("firstNameInner" + id).value;
//     var lastNameVal = document.getElementById("lastNameInner" + id).value;
//     var emailVal = document.getElementById("emailInner" + id).value;
//     var phoneVal = document.getElementById("phoneInner" + id).value;
//     var idVal = ids[id]

//     document.getElementById("first_Name" + id).innerHTML = namef_val;
//     document.getElementById("last_Name" + id).innerHTML = namel_val;
//     document.getElementById("email" + id).innerHTML = email_val;
//     document.getElementById("phone" + id).innerHTML = phone_val;

//     document.getElementById("edit_button" + id).style.display = "inline-block";
//     document.getElementById("save_button" + id).style.display = "none";

//     let tmp = {
//         phoneNumber: phone_val,
//         emailAddress: email_val,
//         newFirstName: namef_val,
//         newLastName: namel_val,
//         id: id_val
//     };

//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/UpdateContacts.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                 console.log("Contact has been updated");
//                 loadContacts();
//             }
//         };
//         xhr.send(jsonPayload);
//     } catch (err) {
//         console.log(err.message);
//     }
// }

// function delete_row(no) {
//     var namef_val = document.getElementById("first_Name" + no).innerText;
//     var namel_val = document.getElementById("last_Name" + no).innerText;
//     nameOne = namef_val.substring(0, namef_val.length);
//     nameTwo = namel_val.substring(0, namel_val.length);
//     let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
//     if (check === true) {
//         document.getElementById("row" + no + "").outerHTML = "";
//         let tmp = {
//             firstName: nameOne,
//             lastName: nameTwo,
//             userId: userId
//         };

//         let jsonPayload = JSON.stringify(tmp);

//         let url = urlBase + '/DeleteContacts.' + extension;

//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", url, true);
//         xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//         try {
//             xhr.onreadystatechange = function () {
//                 if (this.readyState == 4 && this.status == 200) {

//                     console.log("Contact has been deleted");
//                     loadContacts();
//                 }
//             };
//             xhr.send(jsonPayload);
//         } catch (err) {
//             console.log(err.message);
//         }

//     };

// }