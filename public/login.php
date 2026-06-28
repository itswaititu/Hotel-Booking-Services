<?php
session_start();

// Correct username and password
$correct_username = "admin";
$correct_password = "12345";

// Get data from the form
$username = $_POST['username'];
$password = $_POST['password'];

// Check credentials
if($username == $correct_username && $password == $correct_password){

    $_SESSION['username'] = $username;

    // Redirect to home.html
    header("Location: Index.html");
    exit();

}else{

    echo "<script>
    alert('Incorrect Username or Password!');
    window.location.href='login.html';
    </script>";

}
?>