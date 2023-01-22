const urlBase = 'http://104.248.225.220/LAMPAPI';
const extension = 'php';

function register() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let email = document.getElementById("newEmail").value;
    let password = document.getElementById("newPassword");

    document.getElementById("registerStatus").innerHTML = "";

    let tmp = {firstName: firstName, LastName: lastName, Email: email, Password: password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register' + extension;
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
        }
        xhr.send(jsonPayload);
    } 
    catch(err) {
        document.getElementById("registerItem").innerHTM = "Failed To Register";
    }
}