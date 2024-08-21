$(document).ready(function() {
    console.log('JavaScript file is loaded');

    let currData; // Declare the variable to store the data

    // Immediately perform the AJAX request when the document is ready
    $.ajax({
        url: '../inside/personalInfo.php',
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

    function openModal(modalClass) {
        const modal = document.querySelector(`.${modalClass}`);
        if (modal) {
            modal.showModal();
            localStorage.setItem(`${modalClass}Open`, 'true'); 
        }
    }

    function closeModal(modalClass) {
        const modal = document.querySelector(`.${modalClass}`);
        if (modal) {
            modal.close();
            localStorage.removeItem(`${modalClass}Open`);
            localStorage.removeItem(`${modalClass}ReactData`); // Optionally clear stored data
        }
    }

    const modals = [
        { openButton: ".create-company", closeButton: "#company-create-close", modalClass: "company-create" },
        { openButton: ".edit-company", closeButton: "#company-edit-close", modalClass: "company-edit" },
        { openButton: ".join-company", closeButton: "#company-select-close", modalClass: "company-select" }
    ];

    modals.forEach(({ openButton, closeButton, modalClass }) => {
        const openModalButton = document.querySelector(openButton);
        const closeModalButton = document.querySelector(closeButton);

        if (openModalButton && closeModalButton) {
            openModalButton.addEventListener('click', (event) => {
                event.preventDefault();
                openModal(modalClass);
            });

            closeModalButton.addEventListener('click', () => {
                closeModal(modalClass);
            });

            // Check the modal state on page load
            if (localStorage.getItem(`${modalClass}Open`) === 'true') {
                openModal(modalClass);
            }
        }
    });

    const personal_form = document.querySelector('.personal-info');
    if (personal_form) {
        personal_form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const formData = {
                firstName: $('input[name="firstName"]').val(),
                lastName: $('input[name="lastName"]').val(),
                email: $('input[name="email"]').val(),
                phoneNumber: $('input[name="phoneNumber"]').val(),
                userId: currData.id // Include the user ID from currData
            };

            $.ajax({
                url: 'http://localhost:3000/update-user',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log('User information updated successfully:', response);
                    // Optionally, handle UI updates here
                },
                error: function(error) {
                    console.error('Error updating user information:', error);
                    const root = ReactDOM.createRoot(document.querySelector(".personal-error"));
                    root.render(<p className="error-message">Error Updating Info: Email already exists</p>);
                }
            });
        });
    }

    function confirmPassword(password) {
        const minLength = 8;
        return password.length >= minLength &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
    }

    const company_create_form = document.querySelector('.company-create-form');
    if (company_create_form) {
        company_create_form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            
            const formData = {
                companyName: $('input[name="companyName"]').val(),
                companyEmail: $('input[name="companyEmail"]').val(),
                companyPhoneNumber: $('input[name="companyPhoneNumber"]').val(),
                passwordHash: $('input[name="companyPassword"]').val(),
                userId: currData.id
            };
            console.log(formData);

            const password = $('input[name="companyPassword"]').val();

            console.log(password);
            if (password) {
                if (!confirmPassword(password)) {
                     // Save React data
                    const root = ReactDOM.createRoot(document.querySelector('.create-error'));
                    const invalidResponse = (
                        <p className="error-message">Password must be 8 characters long, and contain lowercase, uppercase, and digit characters</p>
                    );
                    root.render(invalidResponse);
                    console.log('Password validation failed');
                } else {
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        if (err) {
                            console.error("Error hashing password:", err);
                            return;
                        }
                        formData.passwordHash = hash;

                        $.ajax({
                            url: 'http://localhost:3000/update-user',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(formData),
                            success: (res) => {
                                console.log('Create Company Successful:', res);
                            },
                            error: (error) => {
                                console.error('Error occurred updating database:', error);
                                const errorResponse = (
                                    <p className="error-message">Error Updating Info: Email may already exist</p>
                                );
                                const root = ReactDOM.createRoot(document.querySelector('.company-create'));
                                root.render(errorResponse);
                            }
                        });
                    });
                }
            } else {
                $.ajax({
                    url: 'http://localhost:3000/update-user',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: (res) => {
                        console.log('Create Company Successful:', res);
                    },
                    error: (error) => {
                        console.error('Error occurred updating database:', error);
                        const errorResponse = (
                            <p className="error-message">Error Updating Info: Email already exists</p>
                        );
                        const root = ReactDOM.createRoot(document.querySelector('.create-error'));
                        root.render(errorResponse);
                    }
                });
            }
        });

        // Re-render React components if modal was open
        
    }

    
    
});
