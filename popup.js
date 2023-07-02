chrome.storage.sync.get({
    record: '',
    url: ''
}, function(items) {
    console.log("Laddar popup...")
    const record = items.record;
    const url = items.url;

    function getStatusClasses(status) {
        if (status === 4) {
            return {bgColor: 'bg-warning', textColor: 'black'};
        } else if (status === 16) {
            return {bgColor: 'bg-danger', textColor: 'white'};
        } else {
            return "";
        }
    }

    if(record) {
        let warningAlertElement = document.getElementById("warningdiv");
        warningAlertElement.className += " d-none";

        let tableElement = document.createElement('table');
        tableElement.className="table";

        let tbodyElement = document.createElement("tbody");

        for (let i = 0; i < Object.keys(record.data.servicelist).length; i++) {
            let hostname=Object.keys(record.data.servicelist)[i];
            let hostnameTrElement = document.createElement("tr");
            let hostnamneThElement = document.createElement('th');
            hostnamneThElement.setAttribute("scope", "row");
            hostnamneThElement.innerHTML=hostname;
            hostnameTrElement.appendChild(hostnamneThElement);

            let serviceArr = [];

            for (let j = 0; j < Object.keys(Object.values(record.data.servicelist)[i]).length; j++) {

                let servicename = Object.keys(Object.values(record.data.servicelist)[i])[j];
                let status = Object.values(Object.values(record.data.servicelist)[i])[j];

                let trElement = document.createElement("tr");

                let serviceTdElement = document.createElement("td");
                let statusClasses = getStatusClasses(status);
                if(statusClasses) {
                    serviceTdElement.className = statusClasses.bgColor;

                    let link=document.createElement("a");
                    link.style.color = statusClasses.textColor;
                    link.href = url + "/cgi-bin/nagios4/extinfo.cgi?type=2&host=" + hostname + "&service=" + servicename.replace(" ", "+");
                    link.innerHTML = servicename;
                    link.target = "_blank";

                    serviceTdElement.appendChild(link);
                    trElement.appendChild(serviceTdElement);
                    serviceArr.push(trElement)
                }
            }

            if(serviceArr.length > 0) {
                tbodyElement.appendChild(hostnameTrElement);
                for (const serviceElement of serviceArr) {
                    tbodyElement.appendChild(serviceElement);
                }
            }
        }
        tableElement.appendChild(tbodyElement);
        document.getElementById('statusdiv').appendChild(tableElement);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const filters = document.getElementsByClassName('form-check-input');
    for (const filter of filters) {
        filter.addEventListener('change', function() {
            let statusDiv = document.querySelector('#statusdiv');
            let elementsByClassName = statusDiv.querySelectorAll('.' + this.value);
            if (this.checked) {
                for (const elementsByClassNameElement of elementsByClassName) {
                    elementsByClassNameElement.style.display='table-cell';
                }
            } else {
                for (const elementsByClassNameElement of elementsByClassName) {
                    elementsByClassNameElement.style.display='none';
                }
            }
        });
    }
});

