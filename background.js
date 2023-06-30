// Default interval (in milliseconds)
let interval = 1 * 60 * 1000; // 1 minute
let timeoutId;
const path="/nagios4/cgi-bin/statusjson.cgi?query=servicelist";

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
                    let badgeTextAndColor = findBadgeTextAndColor(record);
                    chrome.action.setBadgeText({ text: badgeTextAndColor.text });
                    chrome.action.setBadgeBackgroundColor({ color: badgeTextAndColor.color });

                    // Perform additional actions with the parsed data here
                    chrome.storage.sync.set({
                        record: record
                    }, function() {
                        console.log('Lista av Nagios-tjänster sparad.');
                    });
                })
                .catch(error => {
                    chrome.action.setBadgeText({ text: "!" });
                    chrome.action.setBadgeBackgroundColor({ color: "orange" });

                    console.error('Fel vid hämtning av Nagios-data:', error);

                    chrome.storage.sync.set({
                        record: ''
                    }, function() {
                        console.log('Lista av Nagios-tjänster rensad efter fel vid hämtning.');
                    });
                });
        } else {
            console.log('Ingen URL satt, hoppar över hämtning av data');
        }

        // Call fetchJSONPeriodically again after the interval
        timeoutId = setTimeout(fetchJSONPeriodically, interval);
    });
}

function findBadgeTextAndColor(record) {
    let critical = 0;
    let warning = 0;

    for (let i = 0; i < Object.keys(record.data.servicelist).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(record.data.servicelist)[i]).length; j++) {
            let status = Object.values(Object.values(record.data.servicelist)[i])[j];

            if(status == 16) {
                critical++;
            } else if(status == 4) {
                warning++;
            }
        }
    }
    if(critical == 0 && warning == 0) {
      return {text: 'OK', color:'green'};
    } else if(critical >= warning) {
        return {text: "" + critical, color:'red'};
    } else return {text: "" + warning, color:'yellow'};
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
        interval = changes.interval || interval;
        // Restart fetching JSON with the updated interval
        clearTimeout(timeoutId);
        fetchJSONPeriodically();
    }
});
