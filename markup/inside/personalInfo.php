<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

if(isset($_SESSION["user_id"])) {

    define('ROOTPATH', __DIR__);

    $mysqli = require __DIR__ . "/database.php";

    $sql = "SELECT * FROM user WHERE id = {$_SESSION["user_id"]}";

    $result = $mysqli->query($sql);

    $user = $result->fetch_assoc();
}

if(isset($user["company_id"])) {

    $mysqli = require __DIR__ . "/database.php";

    $sql = "SELECT * FROM companies WHERE id = {$user["company_id"]}";

    $result = $mysqli->query($sql);
    $companies = $result->fetch_assoc();
}

// Check if the request is an AJAX request
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
    <meta name="description" content="Personal Info" />

    <title>Personal Info</title>

    <link rel="icon" href="" type="image/x-icon" />
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel="stylesheet" />
    <link href="../../stylesheet/sideBar.css" type="text/css" rel="stylesheet"/>
    <link href="../../stylesheet/personalInfo.css" type="text/css" rel="stylesheet"/>

    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>


    <script type="text/babel" src="../../js/personalInfo_client.js"></script>
    
    
</head>
<body>
    <div class="sidebar">
        <div class="top">
            <div class="logo">
                <img src="../../images/logo-black.png" alt="Logo"></img>
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
            <li><a href="landingScreen.php"><i class="bx bxs-grid-alt"></i><span class="nav-item">Dashboard</span></a><span class="tooltip">Dashboard</span></li>
            <li><a href="personalInfo.php"><i class="bx bxs-user-circle"></i><span class="nav-item">My Profile</span></a><span class="tooltip">Profile</span></li>
            <li><a href="orderManager.php"><i class="bx bx-windows"></i><span class="nav-item">Project Manager</span></a><span class="tooltip">Project-Manager</span></li>
            <li><a href="finances.php"><i class="bx bx-stats"></i><span class="nav-item">Finances</span></a><span class="tooltip">Finances</span></li>
            <li><a href="Settings.php"><i class="bx bx-cog"></i><span class="nav-item">Settings</span></a><span class="tooltip">Settings</span></li>
            <li><a href="../logout.php.php"><i class="bx bx-log-out"></i><span class="nav-item">Log out</span></a><span class="tooltip">Log out</span></li>
        </ul>
    </div>
    <div class="main-content">
        <section class="body-section">
            <div class="title-section">
                <img src="../../images/defaultPfp.png" alt="profile image" id="headImage"></img>
                <h1> Personal Info </h1>
            </div>
            <hr/>
            <form class="personal-info" name="personal">
                <fieldset class="personal-section">
                    <p class="input-label">
                        <label for="firstName">First Name: </label>
                        <input name="firstName" type="text" placeholder="<?= htmlspecialchars($user["first_name"]) ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="lastName">Last Name: </label>
                        <input name="lastName" type="text" placeholder="<?= htmlspecialchars($user["last_name"]) ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="email">Email: </label>
                        <input name="email" type="text" placeholder="<?= htmlspecialchars($user["email"] ?? "Email") ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="phoneNumber">Phone Number: </label>
                        <input name="phoneNumber" type="text" placeholder="<?= htmlspecialchars($user["phone_number"] ?? "Phone Number") ?>" required>
                    </p>
                    <div class="react personal-error"></div>
                    <div class="react personal-success"></div>
                    <button type="submit" class="button submit-personal-info"> Update </button>
                    <button class="button change-password"> Change Password </button>
                </fieldset>
            </form>
            <form class="company-info" name="company">
                <fieldset class="company-section" name="company">
                    <p class="fineprint"> You may only be part of 1 Company at a time. Joining/Creating a new company will remove you from your former</p>
                    <p class="input-label">
                        <label for="company-name">Company Name: </label>
                        <input name="company-name" type="text" placeholder="<?= htmlspecialchars($companies["company_name"] ?? "company name") ?>" required disabled>
                    </p>
                    <p class="input-label">
                        <label for="company-id">Company ID: </label>
                        <input name="company-id" type="text" placeholder="<?= htmlspecialchars($companies["id"] ?? "company id") ?>" required disabled>
                    </p>                                                                                                                                                                                                                         
                    <p class="input-label">
                        <label for="company-email">Company Email: </label>
                        <input name="company-email" type="text" placeholder="<?= htmlspecialchars($companies["company_email"] ?? "company email") ?>" required disabled>
                    </p>
                    <p class="input-label">
                        <label for="company-phoneNumber">Company Phone Number: </label>
                        <input name="company-phoneNumber" type="tel" placeholder="<?= htmlspecialchars($companies["company_phone_number"] ?? "company phone number") ?>" required disabled>
                    </p>
                    <button class="button join-company">Join New Company</button> 
                    <?php if (isset($user["company_id"])): ?>
                        <button class="button edit-company">Edit Company Details </button>
                    <?php endif; ?>
                    <button class="button create-company"> Create New Company</button>
                </fieldset>
            </form>
            <dialog class="company-select">
                <i class="bx bxs-x-circle" id="company-select-close"></i>
                <div class="react company-select-div"></div>
            </dialog>

            <dialog class="company-edit">
                <i class="bx bxs-x-circle" id="company-edit-close"></i>
                
                <form class="company-edit-form" name="company-edit-form">
                    <p class="input-label">
                        <label for="companyName">Company Name: </label>
                        <input name="companyName" type="text" placeholder="<?= htmlspecialchars($companies["company_name"] ?? "company name") ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="companyEmail">Company Email: </label>
                        <input name="companyEmail" type="text" placeholder="<?= htmlspecialchars($companies["company_email"] ?? "company email") ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="companyPhoneNumber">Company Phone Number: </label>
                        <input name="companyPhoneNumber" type="tel" placeholder="<?= htmlspecialchars($companies["company_phone_number"] ?? "company phone number") ?>" required>
                    </p>

                    <p class="input-label">
                        <label for="companyPassword">Password(Optional): </label>
                        <p class="fineprint">Enter Password for Restricted Access, otherwise leave blank</p>
                        <input name="companyPassword" type="Password" placeholder="password(encrypted)">
                    </p>

                    <div class="react edit-error"></div>
                    <div class="react edit-success"></div>

                    <button type="submit">Update</button>
                    


                </form>
            </dialog>

            <dialog class="company-create">
                <i class="bx bxs-x-circle" id="company-create-close"></i>
                
                <form class="company-create-form" name="company-create">
                    <p class="input-label">
                        <label for="companyName">Company Name: </label>
                        <input name="companyName" type="text" placeholder="<?= htmlspecialchars($companies["company_name"] ?? "company name") ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="companyEmail">Company Email: </label>
                        <input name="companyEmail" type="text" placeholder="<?= htmlspecialchars($companies["company_email"] ?? "company email") ?>" required>
                    </p>
                    <p class="input-label">
                        <label for="companyPhoneNumber">Company Phone Number: </label>
                        <input name="companyPhoneNumber" type="tel" placeholder="<?= htmlspecialchars($companies["company_phone_number"] ?? "company phone number") ?>" required>
                    </p>

                    <p class="input-label">
                        <label for="companyPassword">Password(Optional): </label>
                        <p class="fineprint">Enter Password for Restricted Access, otherwise leave blank</p>
                        <input name="companyPassword" type="Password" placeholder="password(encrypted)">
                    </p>

                    <div class="react create-error"></div>
                    <div class="react create-success"></div>
                    

                    <button type="submit">Create</button>
                    


                </form>
            </dialog>


        </section>
    </div>
    <script>
        let btn = document.querySelector('#btn');
        let sidebar = document.querySelector('.sidebar');

        btn.onclick = function () {
            sidebar.classList.toggle('active');
        }
    </script>
</body>
</html>
