<?php
    $cheminImage = $_GET['url'];

    if (file_exists($cheminImage)) {
        echo "true";
    } else {
        echo "false";
    }
?>
