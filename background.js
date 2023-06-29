// Default interval (in milliseconds)
let interval = 1 * 60 * 1000; // 1 minute
let timeoutId;
const path="/nagios4/cgi-bin/statusjson.cgi?query=servicelist&servicestatus=critical";

// Function to fetch and parse JSON data with the specified interval
function fetchJSONPeriodically() {
    // Retrieve the URL from chrome.storage
    chrome.storage.sync.get({url:'',
        username:'',
        password:''}, function (items) {
        const url = items.url;
        const username = items.username;
        const password = items.password;

        if(url) {
            console.log("username = " + username + ", password = " + password);
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
            // Fetch and parse JSON data
            fetch(url + path,
                {method:'GET',
                    // mode: "no-cors",
                    headers: headers
                })
                .then(response => response.json())
                .then(record => {
                    // Process the JSON data
                    let numberOfCriticalServices = getNumberOfFlaggedServices(record);
                    if(numberOfCriticalServices > 0) {
                        chrome.action.setBadgeText({ text: "" + numberOfCriticalServices });
                        chrome.action.setBadgeBackgroundColor({ color: "red" });
                    } else {
                        chrome.action.setBadgeText({ text: 'OK' });
                        chrome.action.setBadgeBackgroundColor({ color: "green" });
                    }

                    // Perform additional actions with the parsed data here
                    chrome.storage.sync.set({
                        record: record
                    }, function() {
                        console.log('Lista sparad.');
                    });
                })
                .catch(error => {
                    chrome.action.setBadgeText({ text: "!" });
                    chrome.action.setBadgeBackgroundColor({ color: "orange" });

                    chrome.storage.sync.set({
                        record: ''
                    }, function() {
                        console.log('Lista rensad.');
                    });

                    console.error('Fel vid hämtning av json:', error);
                });
        } else {
            console.log('Ingen URL satt, hoppar över hämtning av data');
        }

        // Call fetchJSONPeriodically again after the interval
        timeoutId = setTimeout(fetchJSONPeriodically, interval);
    });
}

// Retrieve the interval from chrome.storage
chrome.storage.sync.get('interval', function (items) {
    interval = items.interval || interval;
    // Start fetching JSON periodically
    fetchJSONPeriodically();
});

// Listen for changes to the interval in chrome.storage
chrome.storage.onChanged.addListener(function (changes) {
    if (changes.interval || changes.url || changes.username || changes.password) {
        interval = changes.interval.newValue || interval;
        // Restart fetching JSON with the updated interval
        clearTimeout(timeoutId);
        fetchJSONPeriodically();
    }
});

function getNumberOfFlaggedServices(record) {
    let number = 0;
    if(record) {
        for (let i = 0; i < Object.keys(record.data.servicelist).length; i++) {
            number += Object.keys(Object.values(record.data.servicelist)[i]).length;
        }
    }
    return number;
}
