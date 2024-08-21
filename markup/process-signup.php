<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (empty($_POST["firstName"])) {
    die("First name is required");
}

if (empty($_POST["lastName"])) {
    die("Last name is required");
}

if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address");
}

if (strlen($_POST["passWord"]) < 8) {
    die("Password must be at least 8 characters");
}

if (!preg_match("/[a-z]/i", $_POST["passWord"])) {
    die("Password must contain at least one letter");
}

if (!preg_match("/[0-9]/", $_POST["passWord"])) {
    die("Password must contain at least one number");
}

if ($_POST["passWord"] !== $_POST["confirm_password"]) {
    die("Passwords must match");
}

$password_hash = password_hash($_POST["passWord"], PASSWORD_DEFAULT);

// Include and check the database connection
$mysqli = require __DIR__ . "/inside/database.php";

if (!$mysqli) {
    die("Database connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO user (first_name, last_name, email, password_hash)
        VALUES (?, ?, ?, ?)";

$stmt = $mysqli->stmt_init();

if (!$stmt->prepare($sql)) {
    die("SQL error: " . $mysqli->error);
}

$stmt->bind_param("ssss", $_POST["firstName"],
                          $_POST["lastName"],
                          $_POST["email"],
                          $password_hash);

if ($stmt->execute()) {
    header("Location: signupSuccess.html");
} else {
    // Output detailed error message
    if ($mysqli->errno === 1062) {
        die("Email already taken");
    } else {
        die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
    }
    
}
?>
