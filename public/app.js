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
    const ftRecommendationString = document.querySelector('#ftrecommendationString');
    const mmRecommendationString = document.querySelector('#mmrecommendationString');


    const meterSelector = document.querySelector('#meter');
    const feetSelector = document.querySelector('#ft');
    const boatLengthNumberSelector = document.querySelector('.boatLengthNumber');
    
    const lineTypeListSelector = document.querySelector('.lineTypeList');
    const sailingStyleListSelectpr = document.querySelector('.sailingStyleList');

    const sailingStyleDiv = document.querySelector('.sailingStyle');
    const lineTypeDiv = document.querySelector('.lineType');
    const recomndationDiv = document.querySelector('.recomndation');

    var boatLengtft;
    var boatLengtmm;
    
    
    var hideAll = () =>{
    document.querySelector('.boatLengthNumberError').style.visibility = "hidden";
    sailingStyleDiv.style.visibility = "hidden";
    lineTypeDiv.style.visibility = "hidden";
    recomndationDiv.style.visibility = "hidden";
    };

    var showAll = () =>{
        document.querySelector('.boatLengthNumberError').style.visibility = "visible";
        sailingStyleDiv.style.visibility = "visible";
        lineTypeDiv.style.visibility = "visible";
        recomndationDiv.style.visibility = "visible";
    };

    hideAll();

    var check = ()=>{
        recomndationDiv.style.visibility = "hidden";
        if(boatClassValue<=0) {hideAll(); return;}
        if(sailingStyleListSelectpr.value.length <=0) {hideAll(); sailingStyleDiv.style.visibility = "visible"; return;}
        if(lineTypeListSelector.value.length <=0) { lineTypeDiv.style.visibility = "visible"; return;}

        showAll();
        getRopeByType(lineTypeListSelector.value, sailingStyleListSelectpr.value, boatClassValue);
    };

    lineTypeListSelector.addEventListener('change', event => check());
    sailingStyleListSelectpr.addEventListener('change', event => check());


    var updateBoatLength = ()=>
    {
        document.querySelector('.boatLengthNumberError').style.visibility = "hidden";
        sailingStyleDiv.style.visibility = "hidden";
        var length = boatLengthNumberSelector.value;
        length = (meterSelector.checked)?length/0.3048:length; 
        boatLengtft = length;
        boatLengtmm = boatLengtft*0.3048;
        boatClassValue = boatLengtft<=15? 3 : Math.ceil((boatLengtft-15)/5)+3;
        if(boatClassValue > 10) 
        {
            document.querySelector('.boatLengthNumberError').style.visibility = "visible"; 
            boatClassValue = 0;
            hideAll();
        }
        console.log("boat class "+boatClassValue);  
        sailingStyleDiv.style.visibility = "visible";
        check();
    };
    boatLengthNumberSelector.addEventListener('change',event=>updateBoatLength());
    

    var boatLengthTypeChanged = (event) =>{
        feetSelector.checked  = (event.currentTarget == feetSelector);
        meterSelector.checked  = (event.currentTarget == meterSelector);
        updateBoatLength();
    };
    meterSelector.addEventListener('change',event =>boatLengthTypeChanged(event));
    feetSelector.addEventListener('change',event =>boatLengthTypeChanged(event));

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


    
    var getRopeByType = (type, sailingTypeName, classId) => {
        var query = ropes
            .where('usage', '==', type)
            .where('sailingType', '==', sailingTypeName)
            .where('class', '==', classId);

        query.get()
        .then(rope =>{
            rope.forEach(doc=>{
                data = doc.data()
                console.log(data);
                ftRecommendationString.innerHTML = `${data.usage} ${Math.round(boatLengtft*data.lengthFactor)} feet Double braided ${data.typeOfRope} rope diameter ${data.inch} inch`;
                mmRecommendationString.innerHTML = `${data.usage} ${Math.round(boatLengtmm*data.lengthFactor)} meter Double braided ${data.typeOfRope} rope diameter ${data.mm} mm`;
                updateRecomendtionView();
            })
        })
    };
   

    var addToDataList = (data,list) =>{
        var option = document.createElement("OPTION");
        option.textContent = data.name;
        option.value = data.name;
        list.appendChild(option);
    }

    var ftRec = document.querySelector('#ftRecomenation');
    var mmRec = document.querySelector('#meterRecomendation');
    var recomendationChange = (event) =>{
        ftRec.checked  = (event.currentTarget == ftRec);
        mmRec.checked  = (event.currentTarget == mmRec);
        updateRecomendtionView();
    };

    var updateRecomendtionView = () => {
        mmRecommendationString.style.visibility = mmRec.checked?"visible":"hidden";
        ftRecommendationString.style.visibility = ftRec.checked?"visible":"hidden";
    };

    ftRec.addEventListener('change', event => recomendationChange(event));
    mmRec.addEventListener('change', event => recomendationChange(event));




    

});








