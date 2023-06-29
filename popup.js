chrome.storage.sync.get({
    url: '',
    username: '',
    password: ''
}, function(items) {
    document.getElementById('url').value = items.url;
    document.getElementById('username').value = items.username;
    document.getElementById('password').value = items.password;
});
