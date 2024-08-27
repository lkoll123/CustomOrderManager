<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

if(isset($_SESSION["user_id"])) {

    define('ROOTPATH', __DIR__);

    $mysqli = require __DIR__ . "/database.php";

    $sql = "SELECT * FROM user
                WHERE id = {$_SESSION["user_id"]}";

    $sql2 = "SELECT * FROM oauth_tokens
                WHERE user_id = {$_SESSION["user_id"]}";

    $result = $mysqli->query($sql);

    $result2 = $mysqli->query($sql2);

    $user = $result->fetch_assoc();
    $user_oauth = $result2->fetch_assoc();


}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'true') {
    // Return session data as JSON
    header('Content-Type: application/json');
    echo json_encode($user);
    exit(); // Ensure no further HTML is output
}


?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />

        <meta name="author" content="Luka Koll"/>
        <meta name="author" content="Daniel Fritsch" />
        <meta name="description" content="Project Manager" />

        <title>Project Manager</title>

        <link rel="icon" href="" type="image/x-icon" />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel="stylesheet" />

        <link href="../../stylesheet/sideBar.css" type="text/css" rel="stylesheet"/>
        <link href="../../stylesheet/orderManager.css" type="text/css" rel="stylesheet"/>

        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <script type="text/babel" src="../../js/orderManager_client.js"></script>
    </head>

    <body>
        <div class="sidebar">
            <div class="top">
                <div class="logo">
                    <img src="../../images/logo-black.png"></img>
                    <span>Mirai Solutions</span>
                    
                </div>
                <i class="bx bx-menu" id="btn"></i>
            </div>
            <hr>
            <div class="user">
                <img src="../../images/defaultPfp.png" alt="User Image" class="user-img">
                <div>
                    <p class="bold"> <?= htmlspecialchars($user["first_name"] . " " . $user["last_name"]) ?> </p>
                </div>
            </div>
            <ul>
                <li>
                    <a href="landingScreen.php">
                        <i class="bx bxs-grid-alt"></i>
                        <span class="nav-item">Dashboard</span>
                    </a>
                    <span class="tooltip">Dashboard</span>
                </li>
                <li>
                    <a href="personalInfo.php">
                        <i class="bx bxs-user-circle"></i>
                        <span class="nav-item">My Profile</span>
                    </a>
                    <span class="tooltip">Profile</span>
                </li>
                <li>
                    <a href="orderManager.php">
                        <i class="bx bx-windows"></i>
                        <span class="nav-item">Project Manager</span>
                    </a>
                    <span class="tooltip">Project-Manager</span>
                </li>
                <li>
                    <a href="finances.php">
                        <i class="bx bx-stats"></i>
                        <span class="nav-item">Finances</span>
                    </a>
                    <span class="tooltip">Finances</span>
                </li>
                <li>
                    <a href="Settings.php">
                        <i class="bx bx-cog"></i>
                        <span class="nav-item">Settings</span>
                    </a>
                    <span class="tooltip">Settings</span>
                </li>
                <li>
                    <a href="../logout.php.php">
                        <i class="bx bx-log-out"></i>
                        <span class="nav-item">Log out</span>
                    </a>
                    <span class="tooltip">Log out</span>
                </li>
            </ul>

        </div>
        
        <div class="main-content">
            <section class="body-section">
                <div class="title-section">
                    <div class="top-section">
                        <img src="../../images/stackIcon.png" alt="profile image" id="headImage"></img>
                        <h1> Project Manager </h1>
                    </div>
                    <p class="fineprint warning"><strong>*Please join/create a company and before use. Customer profiles will not be saved otherwise</strong> </p>
                    <?php if(isset($user_oauth["access_token"])): ?>
                        <p class="fineprint success">Email successfully authenticated!</p>
                    <?php else: ?>
                        <p class="fineprint warning">*Email Authentication in <a href="Settings.php">Settings</a> tab is highly Recommended</p>
                    <?php endif; ?>
                    
                </div>
                
                <hr>
                <div class="react project-manager"></div>
            </section>
        </div>
        
                

        

        

    </body>

    <script>
        let btn = document.querySelector('#btn');
        let sidebar = document.querySelector('.sidebar');

        btn.onclick = function () {
            sidebar.classList.toggle('active');
        }
    </script>

</html>