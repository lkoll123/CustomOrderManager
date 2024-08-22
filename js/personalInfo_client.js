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
                    const successResponse = (
                        <p className="success-message">Successfully updated profile!</p>
                    );
                    const root = ReactDOM.createRoot(document.querySelector('.personal-success'));
                    root.render(successResponse);
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
                companyName: $('.company-create-form input[name="companyName"]').val(),
                companyEmail: $('.company-create-form input[name="companyEmail"]').val(),
                companyPhoneNumber: $('.company-create-form input[name="companyPhoneNumber"]').val(),
                passwordHash: '',
                userId: currData.id
            };
            
            const password = $('.company-create-form input[name="companyPassword"]').val();

            console.log($('input[name="companyName"]').val())

            console.log(formData);
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
                    const hashedPassword = CryptoJS.SHA256(password).toString();
                    formData.passwordHash = hashedPassword;

                    $.ajax({
                        url: 'http://localhost:3000/create-company',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(formData),
                        success: (res) => {
                            console.log('Create Company Successful:', res);
                            const successResponse = (
                                <p className="success-message">Successfully created company!</p>
                            );
                            const root = ReactDOM.createRoot(document.querySelector('.create-success'));
                            root.render(successResponse);
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
            } else {
                $.ajax({
                    url: 'http://localhost:3000/create-company',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: (res) => {
                        console.log('Create Company Successful:', res);
                        const successResponse = (
                            <p className="success-message">Successfully created company!</p>
                        );
                        const root = ReactDOM.createRoot(document.querySelector('.create-success'));
                        root.render(successResponse);
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

    const company_edit_form = document.querySelector('.company-edit-form');
    if(company_edit_form) {
        company_edit_form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = {
                companyName: $('input[name="companyName"]').val(),
                companyEmail: $('input[name="companyEmail"]').val(),
                companyPhoneNumber: $('input[name="companyPhoneNumber"]').val(),
                passwordHash: '',
                userId: currData.id,
                companyId: currData.company_id
            };
            

            const password = $('input[name="companyPassword"]').val();

            console.log(formData);
            if (password) {
                if (!confirmPassword(password)) {
                     // Save React data
                    const root = ReactDOM.createRoot(document.querySelector('.edit-error'));
                    const invalidResponse = (
                        <p className="error-message">Password must be 8 characters long, and contain lowercase, uppercase, and digit characters</p>
                    );
                    root.render(invalidResponse);
                    console.log('Password validation failed');
                } else {
                    const hashedPassword = CryptoJS.SHA256(password).toString();
                    formData.passwordHash = hashedPassword;

                    $.ajax({
                        url: 'http://localhost:3000/edit-company',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(formData),
                        success: (res) => {
                            console.log('Edit Company Successful:', res);
                            const successResponse = (
                                <p className="success-message">Successfully updated company!</p>
                            );
                            const root = ReactDOM.createRoot(document.querySelector('.edit-success'));
                            root.render(successResponse);
                        },
                        error: (error) => {
                            console.error('Error occurred updating database:', error);
                            const errorResponse = (
                                <p className="error-message">Error Updating Info: Email already exists</p>
                            );
                            const root = ReactDOM.createRoot(document.querySelector('.edit-error'));
                            root.render(errorResponse);
                        }
                    });
                }
            } else {
                $.ajax({
                    url: 'http://localhost:3000/edit-company',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: (res) => {
                        console.log('Edit Company Successful:', res);
                        const successResponse = (
                            <p className="success-message">Successfully updated company!</p>
                        );
                        const root = ReactDOM.createRoot(document.querySelector('.edit-success'));
                        root.render(successResponse);
                    },
                    error: (error) => {
                        console.error('Error occurred updating database:', error);
                        const errorResponse = (
                            <p className="error-message">Error Updating Info: Email already exists</p>
                        );
                        const root = ReactDOM.createRoot(document.querySelector('.edit-error'));
                        root.render(errorResponse);
                    }
                });
            }
        })
    }



    
    async function renderJoinData() {
        try {
            // Fetch the data
            const response = await $.ajax({
                url: 'http://localhost:3000/query-companies',
                method: 'GET',
                data: { ajax: 'true' },
                dataType: 'json'
            });
            console.log(response);
    
            // Save the response data
            const join_company_data = response;
    
            // Ensure the element exists
            const join_form = document.querySelector(".react.company-select-div");
            if (!join_form) {
                console.error('Element with class .react.company-select not found');
                return;
            }
    
            // Create a React root and render the data
            const root = ReactDOM.createRoot(join_form);
    
            // Define the React component
            const FormDataList = () => {
                const [selectedCompanyId, setSelectedCompanyId] = React.useState(null);
                const [passwordRequired, setPasswordRequired] = React.useState(false);

                const passwordInputRef = React.useRef(null);
            
                // Handle the change in the select element
                const handleSelectChange = (event) => {
                    const companyId = event.target.value;
                    setSelectedCompanyId(companyId);
                    const currCompany = join_company_data.find((company) => company.id == companyId);
                    console.log(currCompany);
                    setPasswordRequired(currCompany ? currCompany.password_required : false);
                };
            
                // Handle form submission
                const handleSubmit = (event) => {
                    event.preventDefault();
                    console.log('Selected Company ID:', selectedCompanyId);
                    const companyId = selectedCompanyId;
                    const formData = {
                        userId: currData.id,
                        companyId: selectedCompanyId,
                        companyName: join_company_data.find((company) => company.id == companyId).company_name
                    }
                    if (passwordRequired) {
                        const password = passwordInputRef.current.value;
                        const hashedPassword = CryptoJS.SHA256(password).toString();
                        const actualHashedPassword = join_company_data.find((company) => company.id == companyId).password;
                        if (hashedPassword === actualHashedPassword) {
                            $.ajax({
                                url: 'http://localhost:3000/join-company',
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(formData),
                                success: (res) => {
                                    console.log('Edit Company Successful:', res);
                                    const successResponse = (
                                        <p className="success-message">Successfully joined company!</p>
                                    );
                                    const root = ReactDOM.createRoot(document.querySelector('.join-success'));
                                    root.render(successResponse);
                                },
                                error: (error) => {
                                    console.error('Error occurred updating database:', error);
                                    
                                }
                            });
                        } else {
                            const errorResponse = (
                                <p className="error-message">Failed to join company: Incorrect password</p>
                            );
                            const root = ReactDOM.createRoot(document.querySelector('.join-error'));
                            root.render(errorResponse);
                        }

                    } else {
                        $.ajax({
                            url: 'http://localhost:3000/join-company',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(formData),
                            success: (res) => {
                                console.log('Edit Company Successful:', res);
                                const successResponse = (
                                    <p className="success-message">Successfully joined company!</p>
                                );
                                const root = ReactDOM.createRoot(document.querySelector('.join-success'));
                                root.render(successResponse);
                            },
                            error: (error) => {
                                console.error('Error occurred updating database:', error);
                                
                            }
                        });
                    }

                    
                    // You can now use `selectedCompanyId` for further actions, like sending it to the server
                    // For example, you might send an AJAX request or update some other state
                };
            
                const join_company_elements = join_company_data.map((company) => {
                    const optionContent = `${company.company_name} (Company Id: ${company.id})`;
                    return <option key={company.id} value={company.id}>{optionContent}</option>;
                });
            
                return (
                    <form onSubmit={handleSubmit} className="company-select-form">
                        <p className="input-label">
                            <label htmlFor="joinSelect" className="input-label">Choose Company: </label>
                            <select name="joinSelect" className="join-select" onChange={handleSelectChange}>
                                <option value="">Select a company</option>
                                {join_company_elements}
                            </select>
                        </p>
                        
            
                        {passwordRequired && (
                            <p className="input-label">
                                <label htmlFor="companyPassword">Company Password: </label>
                                <input name="companyPassword" type="password" placeholder="password(encrypted)" ref={passwordInputRef} required/>
                            </p>
                        )}

                        <div className="react join-error"></div>
                        <div className="react join-success"></div>
                        
                        <button type="submit">Join</button>
                    </form>
                );
            };
            
            // Render the component
            root.render(<FormDataList />);
            
    
        } catch (error) {
            console.error('AJAX request failed:', error);
        }
    }
    
    // Call the function to fetch the data
    renderJoinData();
    
    

    



    
    
});
