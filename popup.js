chrome.storage.sync.get({
    record: '',
    url: ''
}, function(items) {
    const record = items.record;
    const url = items.url;
    if(record) {
        for (let i = 0; i < Object.keys(record.data.servicelist).length; i++) {
            let elementType = document.createElement('ul');
            elementType.className="list-group mb-3";

            let elementSubType = document.createElement('li');
            elementSubType.className="list-group-item list-group-item-danger";
            elementSubType.innerHTML=Object.keys(record.data.servicelist)[i];
            elementType.appendChild(elementSubType);

            for (let j = 0; j < Object.keys(Object.values(record.data.servicelist)[i]).length; j++) {
                elementSubType = document.createElement('li');
                elementSubType.className="list-group-item";

                let link=document.createElement("a");
                let hostname=Object.keys(record.data.servicelist)[i];
                let servicename = Object.keys(Object.values(record.data.servicelist)[i])[j];
                link.href=url + "/cgi-bin/nagios4/extinfo.cgi?type=2&host=" + hostname + "&service=" + servicename.replace(" ", "+");
                link.textContent=servicename;
                link.target="_blank";
                elementSubType.appendChild(link);
                // elementSubType.innerHTML=Object.keys(Object.values(record.data.servicelist)[i])[j];
                elementType.appendChild(elementSubType);
            }
            document.getElementById('statusdiv').appendChild(elementType);
        }
    }
});
