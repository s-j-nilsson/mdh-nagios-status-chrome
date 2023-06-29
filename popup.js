chrome.storage.sync.get({
    record: ''
}, function(items) {
    const record = items.record;
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
                elementSubType.innerHTML=Object.keys(Object.values(record.data.servicelist)[i])[j];
                elementType.appendChild(elementSubType);
            }
            document.getElementById('statusdiv').appendChild(elementType);
        }
    }
});
