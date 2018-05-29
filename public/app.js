//var MetersToFeet = require("meters-to-feet");
//var mtf = new MetersToFeet();

document.addEventListener("DOMContentLoaded", event=>
{
    const app = firebase.app();
    const db  = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    db.settings(settings);
    const usages = db.collection('usages');
    const sailingType = db.collection('sailingType');
    const ropes = db.collection('ropes');
    const boatClass = db.collection('boatClass');

    const lineTypes = document.querySelector('#lineType');
    const sailingStyle = document.querySelector('#sailingStyle');

    var boatClassValue;

    sailingType.get().then(sailingType=>{
        sailingType.forEach(doc =>{
            addToDataList(doc.data(), sailingStyle);
        })
    })
    usages.get().then(usages =>{
        usages.forEach(doc=>{
            addToDataList(doc.data(), lineTypes);
        })
    });

    var getRopeByType = type => {
        var query = ropes.where('usageId', '==', type);

        query.get()
        .then(rope =>{
            rope.forEach(doc=>{
                data = doc.data()
                console.log([data, data.usage]);
            })
        })
    };

    var addToDataList = (data,list) =>{
        var option = document.createElement("OPTION");
        option.textContent = data.name;
        option.value = data.name;
        list.appendChild(option);
    }

    var calulateClass = (lnegth, inFeet) =>{
        length = inFeet?length:mft.get(length);        
        console.log(length);
    };
    

});

var meterSelector = document.querySelector('#meter');
var feetSelector = document.querySelector('#ft');
     
function updateBoatLength(event){

    var length = document.querySelector('.boatLengthNumber').value;
    length = (meterSelector.checked)?length/0.3048:length; 
    boatClassValue = length<=15? 3 : Math.ceil((length-15)/5)+3;
    console.log("boat class "+boatClassValue);  
  }

function boatLengthTypeChanged(event){
    feetSelector.checked  = (event.currentTarget == feetSelector);
    meterSelector.checked  = (event.currentTarget == meterSelector);
    updateBoatLength();

}






