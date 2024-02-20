const yourtab=document.querySelector("[data-yourwheather]")
const searchtab=document.querySelector("[data-Searchwheather]")
const weathercontainer=document.querySelector(".wheater-container");
const loadingcontainer=document.querySelector(".loading-container")
const userinformationcontainer=document.querySelector(".user-information-container");
const formcontainer=document.querySelector(".form-container")
const grantlocationcontainer=document.querySelector(".grantlocationacces-container")
const grantaccessbtn=document.querySelector("[grantaccessbtn]")
const searchInput=document.querySelector("[data-searchInput]")
const errorcontainer=document.querySelector(".errorcontainer")

let currenttab=yourtab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currenttab.classList.add("current-tab");
beginssceen();

yourtab.addEventListener("click",()=>{
    switchtab(yourtab);
});

searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
});

function switchtab(newtab){

    if(newtab != currenttab){
        currenttab.classList.remove("current-tab");
        currenttab = newtab;
        currenttab.classList.add("current-tab");

        if(!formcontainer.classList.contains("active")){
            userinformationcontainer.classList.remove("active");
            grantlocationcontainer.classList.remove("active");
            formcontainer.classList.add("active");
        }
        else{
            formcontainer.classList.remove("active");
            userinformationcontainer.classList.remove("active");
            beginssceen();
        }
    }
}

function beginssceen(){

    const localCoordinates=sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantlocationcontainer.classList.add("active");
        errorcontainer.classList.remove("active");
    }
    else{
        errorcontainer.classList.remove("active");
        const coordinates=JSON.parse(localCoordinates);
        fetchdatauser(coordinates);
    }

}

grantaccessbtn.addEventListener("click",()=>{
    getlocation();
})

function getlocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("allow location");
        console.log("hi location");
    } 
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchdatauser(userCoordinates);
}


formcontainer.addEventListener("submit",(e)=>{
    buttunsubmit(e);
});

function buttunsubmit(e){

    e.preventDefault();
    let city = searchInput.value;

    if(city === "")
        return;
    else
        fetchdatasearch(city);
      
}

async function fetchdatauser(coordinates){

    const {lat,lon} = coordinates;
    
    grantlocationcontainer.classList.remove("active");
    loadingcontainer.classList.add("active");

    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
       
        const data=await response.json();
        loadingcontainer.classList.remove("active");
        userinformationcontainer.classList.add("active");

        dataenterinmainposition(data);
    }
    catch(err){
        loadingcontainer.classList.remove("active");
        alert("network connection error ")
    }
}

async function fetchdatasearch(city){

    errorcontainer.classList.remove("active");
    loadingcontainer.classList.add("active");
    userinformationcontainer.classList.remove("active");
    grantlocationcontainer.classList.remove("active");
  
    
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ) 
        
        if(!response.ok){
            throw new Error(response.status);
        } 
        
        const data = await response.json();
        dataenterinmainposition(data);
        console.log("kjmmn");
        loadingcontainer.classList.remove("active");
        userinformationcontainer.classList.add("active");
    }
    catch(err){
        loadingcontainer.classList.remove("active");
        errorcontainer.classList.add("active");
        console.log("hi ");
    }
    
}

function dataenterinmainposition(wheatherInfo){

    const cityName=document.querySelector("[data-cityName]")
    const cityIcon=document.querySelector("[data-cityIcon]")
    const wheatherDesc=document.querySelector("[data-wheatherDesc]")
    const wheatherIcon=document.querySelector("[data-wheatherIcon]")
    const temp=document.querySelector("[data-temp]")
    const humidity=document.querySelector("[data-humidity]")
    const windSpeed=document.querySelector("[data-windSpeed]");
    const cloud=document.querySelector("[data-cloud]");

    console.log(wheatherInfo)

    cityName.innerText=wheatherInfo?.name;
    cityIcon.src=`https://flagcdn.com/144x108/${wheatherInfo?.sys?.country.toLowerCase()}.png`;
    wheatherDesc.innerText=wheatherInfo?.weather?.[0]?.description;
    wheatherIcon.src=`http://openweathermap.org/img/w/${wheatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${wheatherInfo?.main?.temp} °C`;
    windSpeed.innerText= `${wheatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${wheatherInfo?.main?.humidity}%`;
    cloud.innerText = `${wheatherInfo?.clouds?.all}%`;

}

