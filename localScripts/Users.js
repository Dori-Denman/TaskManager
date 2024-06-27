document.addEventListener('DOMContentLoaded', function() {
    enableEditing();
    saveChanges();   
});

//Function to Edit Profile
function enableEditing() {
    // Retrieve username, email, and phone from local storage
    var profileName = localStorage.getItem("username") || '';
    var profileEmail = localStorage.getItem("email") || '';
    var profilePhone = localStorage.getItem("phone") || '';

    document.getElementById('profileName').innerHTML = '<strong>Profile name:</strong> <input type="text" id="profileNameInput" value="' + profileName + '">';
    document.getElementById('profileEmail').innerHTML = '<strong>Email:</strong> <input type="text" id="profileEmailInput" value="' + profileEmail + '">';
    document.getElementById('profilePhone').innerHTML = '<strong>Phone:</strong> <input type="text" id="profilePhoneInput" value="' + profilePhone + '">';

    // Hides the edit button and replaces with save button
    document.getElementById('editProfileBtn').style.display = 'none';
    document.getElementById('saveProfileBtn').style.display = 'inline-block';
}

//Function to Save Profile changes
function saveChanges() {
    var profileName = document.getElementById('profileNameInput').value;
    var profileEmail = document.getElementById('profileEmailInput').value;
    var profilePhone = document.getElementById('profilePhoneInput').value;

    // Store username in local storage and updates username
    var username = profileName;
    localStorage.setItem("username", username);

    // Store email in local storage and updates username
    var email = profileEmail;
    localStorage.setItem("email", email);

    // Store phone in local storage and updates username
    var phone = profilePhone;
    localStorage.setItem("phone", phone);

    document.getElementById('profileName').innerHTML = '<strong>Profile name:</strong> ' + profileName;
    document.getElementById('profileEmail').innerHTML = '<strong>Email:</strong> ' + profileEmail;
    document.getElementById('profilePhone').innerHTML = '<strong>Phone:</strong> ' + profilePhone;

    // Shows the edit button and hides save button
    document.getElementById('editProfileBtn').style.display = 'inline-block';
    document.getElementById('saveProfileBtn').style.display = 'none';
}

