document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('save');
    saveButton.addEventListener('click', saveSettings);
    restoreSettings();
});

function saveSettings() {
    var jsonURL = document.getElementById('jsonURL').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    chrome.storage.sync.set({
        jsonURL: jsonURL,
        username: username,
        password: password
    }, function() {
        console.log('Settings saved.');
    });
}

function restoreSettings() {
    chrome.storage.sync.get({
        jsonURL: '',
        username: '',
        password: ''
    }, function(items) {
        document.getElementById('jsonURL').value = items.jsonURL;
        document.getElementById('username').value = items.username;
        document.getElementById('password').value = items.password;
    });
}
