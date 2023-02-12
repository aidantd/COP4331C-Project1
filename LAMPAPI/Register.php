<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=? ");
		$stmt->bind_param("s", $login);
		$stmt->execute;
		$result = $stmt->$get_result();

		if(result ->fetch_assoc())
		{
			returnWithError("Username already exists")
		}
		else
		{
			// Prepares and executes mySQL statement to add binded input parameters of a new 
		// User into Users Database's respective columns.
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?)");

		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>