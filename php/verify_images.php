<?php
/**
 * Traitement des données JSON avec un script PHP
 *
 * Ce script PHP reçoit des données JSON via une requête HTTP POST, valide le JSON,
 * filtre les URL d'images valides et renvoie le JSON mis à jour avec uniquement les URL d'images valides.
 *
 * Étapes :
 * 1. Lire le contenu JSON brut de la requête HTTP POST.
 * 2. Valider si le JSON est correct.
 * 3. Itérer à travers chaque élément du tableau JSON et filtrer les URL valides.
 * 4. Renvoyer le tableau JSON mis à jour.
 * 
 * @author Thibault F.
 * @version 1.0
 */

// Lire le contenu JSON brut de la requête HTTP POST
$rawJSONData = file_get_contents('php://input');

// Valider si le JSON est correct
$decodedData = json_decode($rawJSONData, true);

if ($decodedData === null && json_last_error() !== JSON_ERROR_NONE) {
    // Gérer l'erreur de JSON invalide
    echo json_encode(['error' => 'JSON invalide']);
    exit;
}

// Fonction pour vérifier si un fichier/image existe
$verifyImage = function($imageUrl) {
    return file_exists($imageUrl);
};

// Itérer à travers chaque élément du tableau JSON et filtrer les URL valides
foreach ($decodedData as &$imageArray) {
    $imageArray = array_filter($imageArray, $verifyImage);
}

// Renvoyer le tableau JSON mis à jour
echo json_encode($decodedData);
?>
