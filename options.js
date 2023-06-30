document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('save');
    saveButton.addEventListener('click', saveSettings);
    restoreSettings();
});

function saveSettings() {
    var url = document.getElementById('url').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var interval = document.getElementById('interval').value;

    chrome.storage.sync.set({
        url: url,
        username: username,
        password: password,
        interval: interval
    }, function() {
        console.log('Settings saved.');
    });
    window.close();
}

function restoreSettings() {
    chrome.storage.sync.get({
        url: '',
        username: '',
        password: '',
        interval: ''
    }, function(items) {
        document.getElementById('url').value = items.url;
        document.getElementById('username').value = items.username;
        document.getElementById('password').value = items.password;
        document.getElementById('interval').value = items.interval;
    });
}
