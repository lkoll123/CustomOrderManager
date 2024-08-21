<?php
$is_invalid = false;
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $mysqli = require __DIR__ . "/inside/database.php";

    $sql = sprintf("SELECT * FROM user
            WHERE email = '%s'",
            $mysqli->real_escape_string($_POST["email"]));
    
    $result = $mysqli->query($sql);

    $user = $result->fetch_assoc();

    
    if($user) {
        if (password_verify($_POST["password"], $user["password_hash"])) {

            session_start();

            session_regenerate_id();

            $_SESSION["user_id"] = $user["id"];

            header("Location: ./inside/landingScreen.php");
            exit();
        }

    }

    $is_invalid = true;
}
?>

<!Doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="author" content="Luka Koll"/>
        <meta name="author" content="Daniel Fritsch" />
        <meta name="description" content="Login Sheet" />

        <title>Login</title>

        <link rel="icon" href="" type="image/x-icon" />
        <link rel="stylesheet" href="../stylesheet/style.css" type="text/css" />

        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

        <script src="/js/login.js"></script>
    </head>
    <body id="loginSheet">
         
        <form name="Login" method="post">
            <fieldset>
                <h1 id="legend">Log In</h1>
                <p class="inputLabel">
                    <label for="email">Email: </label>
                    <input id="email" name="email" type="text" required autocomplete="on" placeholder="Enter your email"
                            value="<?= htmlspecialchars($_POST["email"] ?? "") ?>" >
                </p>

                <p class="inputLabel">
                    <label for="password">Password: </label>
                    <input id="password" name="password" type="password" required autocomplete="on" placeholder="Enter your password">
                </p>

                <button type="submit">Log In</button>
            </fieldset>
        </form>

        <?php if ($is_invalid): ?>
            <em id="errorScript" style="color: red;"> Invalid Login </em>
        <?php endif; ?>


            
        

        <h4>Don't have an account? Sign up <a href="signup.html">here</a>!</h4>
        
    </body>
</html>
