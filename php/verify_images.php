<?php
/**
 * JSON Data Processing PHP Script
 *
 * This PHP script receives JSON data via an HTTP POST request, validates the JSON,
 * filters valid image URLs, and returns updated JSON with only valid image URLs.
 *
 * Steps:
 * 1. Read the raw JSON content from the HTTP POST request.
 * 2. Validate if the JSON is valid.
 * 3. Iterate through each element of the JSON array and filter valid URLs.
 * 4. Return the updated JSON array.
 * 
 * @author Thibault F.
 * @version 1.0
 */

// Read the raw JSON content from the HTTP POST request
$rawJSONData = file_get_contents('php://input');

// Validate if the JSON is valid
$decodedData = json_decode($rawJSONData, true);

if ($decodedData === null && json_last_error() !== JSON_ERROR_NONE) {
    // Handle invalid JSON error
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Function to verify if a file/image exists
$verifyImage = function($imageUrl) {
    return file_exists($imageUrl);
};

// Iterate through each element of the JSON array and filter valid URLs
foreach ($decodedData as &$imageArray) {
    $imageArray = array_filter($imageArray, $verifyImage);
}

// Return the updated JSON array
echo json_encode($decodedData);
?>
