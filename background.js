// Default interval (in milliseconds)
let interval = 5 * 60 * 1000; // 5 minutes

// Function to fetch and parse JSON data with the specified interval
function fetchJSONPeriodically() {
    // Retrieve the URL from chrome.storage
    chrome.storage.sync.get('jsonURL', function (items) {
        const url = items.jsonURL;

        if(url) {
            // Fetch and parse JSON data
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Process the JSON data
                    console.log('Parsed JSON:', data);
                    // Perform additional actions with the parsed data here
                })
                .catch(error => {
                    console.error('Error fetching JSON:', error);
                });
        } else {
            console.log('No URL set in options, skipping fetch');
        }

        // Call fetchJSONPeriodically again after the interval
        setTimeout(fetchJSONPeriodically, interval);
    });
}

// Retrieve the interval from chrome.storage
chrome.storage.sync.get('interval', function (items) {
    interval = items.interval || interval;
    // Start fetching JSON periodically
    fetchJSONPeriodically();
});

// Listen for changes to the interval in chrome.storage
chrome.storage.onChanged.addEventListener(function (changes) {
    if (changes.interval) {
        interval = changes.interval.newValue || interval;
        // Restart fetching JSON with the updated interval
        clearTimeout(fetchTimeout);
        fetchJSONPeriodically();
    }
});
