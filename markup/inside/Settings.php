<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

if(isset($_SESSION["user_id"])) {

    define('ROOTPATH', __DIR__);

    $mysqli = require __DIR__ . "/database.php";

    $sql = "SELECT * FROM user
                WHERE id = {$_SESSION["user_id"]}";

    $result = $mysqli->query($sql);

    $user = $result->fetch_assoc();


}


?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />

        <meta name="author" content="Luka Koll"/>
        <meta name="author" content="Daniel Fritsch" />
        <meta name="description" content="User Settings" />

        <title>Settings</title>

        <link rel="icon" href="" type="image/x-icon" />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel="stylesheet" />

        <link href="../../stylesheet/sideBar.css" type="text/css" rel="stylesheet"/>

        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

        <script src="/Applications/XAMPP/xamppfiles/htdocs/Daniel_Summer_Proj_2024/js/landingScreen.js"></script>
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
                    <a href="../logout.php">
                        <i class="bx bx-log-out"></i>
                        <span class="nav-item">Log out</span>
                    </a>
                    <span class="tooltip">Log out</span>
                </li>
            </ul>

        </div>
        
        <div class="main-content">
            <div class="container">
                <h1>Mirai Solutions </h1>
            </div>
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