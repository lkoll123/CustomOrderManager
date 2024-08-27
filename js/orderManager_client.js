async function everything() {
    let currData;
    await $.ajax({
        url: '../inside/orderManager.php',
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

    let currCustomers;

    const inputData = {
        companyId: currData.company_id
    };
    console.log(inputData);
    if (currData.company_id !== null) {
        
        await $.ajax({
            url: 'http://localhost:3001/query-customers',
            method: 'GET',
            data: inputData,
            dataType:'json',
            contentType: 'application/json',
            success: function(data) {
                currCustomers = data;
            },
            error: function(error) {
                console.error('AJAX request failed:', error);
            }
        })
    }
    console.log(currCustomers);

    const initialState = currCustomers.map((currCustomer) => {
        return {
            name: currCustomer.customer_name,
            email: currCustomer.customer_email,
            bio: currCustomer.customer_bio
        }
    })




    function App() {
        const [showPopup, setShowPopup] = React.useState(false);
        const [profiles, setProfiles] = React.useState(initialState);
        const [formData, setFormData] = React.useState({ name: '', email: '', bio: '' });

        const togglePopup = () => {
            setShowPopup(!showPopup);
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const newProfiles = [...profiles, formData];
            setProfiles(newProfiles);


            if(currData.company_id !== null) {
                const newData = {
                    ...formData,
                    companyId: currData.company_id
                }
                await sendUserDataToBackend(newData);
            }
            


            


            setFormData({ name: '', email: '', bio: '' });
            setShowPopup(false);
        };

        const sendUserDataToBackend = async (data) => {
            try {
                console.log(data);
                $.ajax({
                    url: 'http://localhost:3001/add-customer',
                    method: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',  // Specifies that the request body is JSON
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(error) {
                        console.error('AJAX request failed:', error);
                    }
                });
        
            } catch (error) {
                console.log(error);
            }
        };

        const [selectedProfile, setSelectedProfile] = React.useState(null);

        const handleProfileClick = (profile) => {
            setSelectedProfile(profile);
        };

        const closeProfileDetails = () => {
            setSelectedProfile(null);
        };

        return (
            <main className="content">
                <div className="profile-box" onClick={togglePopup}>
                Create Profile
                </div>

                {profiles.map((profile, index) => (
                <div
                    key={index}
                    className="profile-display-box"
                    onClick={() => handleProfileClick(profile)}
                >
                    {profile.name}
                </div>
                ))}

                {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Profile</h2>
                        <form onSubmit={handleSubmit}>
                        <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <label>
                        Bio:
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                        ></textarea>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    <button className="close-popup" onClick={togglePopup}>
                        Close
                    </button>
                    </div>
                </div>
                )}

                {selectedProfile && (
                <div className="profile-details-fullscreen">
                    <div className="profile-details-header">
                    <h2>{selectedProfile.name}'s Profile</h2>
                    </div>
                    <div className="profile-details-body">
                    <p><strong>Email:</strong> {selectedProfile.email}</p>
                    <p><strong>Bio:</strong> {selectedProfile.bio}</p>
                    {/* Adding several boxes */}
                    <div className="profile-boxes">
                        {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="profile-box-fullwidth">
                            Box {index + 1}
                        </div>
                        ))}
                    </div>
                    <button className="close-popup" onClick={closeProfileDetails}>
                        Close
                    </button>
                    </div>
                </div>
                )}
            </main>
        );
    }

    const mainBody = document.querySelector(".react.project-manager");
    const root = ReactDOM.createRoot(mainBody);
    root.render(<App />);
}

everything();


