$(document).ready(async function() {
    let currData; // Declare the variable to store the data

    // Immediately perform the AJAX request when the document is ready
    await $.ajax({
        url: '../inside/Settings.php',
        method: 'GET',
        data: { ajax: 'true' },
        dataType: 'json',
        success: function(data) {
            currData = data; // Store the user data in currData 
        },
        error: function(error) {
            console.error('AJAX request failed:', error);
        }
    });

    console.log(currData);

    const authenticateButton = document.querySelector('.authenticate')

    authenticateButton.addEventListener('click', (event) => {
        function authenticateUser(userId) {
            // Make a request to your backend to get the OAuth URL
            fetch(`http://localhost:3002/auth?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    // Redirect the user to the OAuth URL
                    window.location.href = data.authUrl;
                })
                .catch(error => {
                    console.error('Error fetching the OAuth URL:', error);
                });
        }
        
        // Example usage:
        authenticateUser(currData.id);
        
    })
});