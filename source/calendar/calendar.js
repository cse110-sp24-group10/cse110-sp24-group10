const monthYear = document.querySelector(".monthANDyear");
dayTag = document.querySelector(".day");
toggleIcons = document.querySelectorAll(".icons span");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
//console.log(date, currYear, currMonth);

//list of months to chooose from
const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

//function that dynamically changes month, year, days
const createCalendar = () => {
    monthYear.innerText = `${months[currMonth]} ${currYear}`;
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let prevLastDateOfMonth = new Date(currYear, currMonth, 0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    let liTag = "";

    //list dates of last month
    for(let i = firstDayOfMonth; i > 0; i--){
        liTag += `<li class="faded">${prevLastDateOfMonth - i + 1}</li>`;
    }
    //list dates of current month
    for(let i = 1; i <= lastDateOfMonth; i++){
        //dynamically get today's date for highlight
        let today = "";
        if(i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()){
            today = "highlighted";
        }
        liTag += `<li class="${today}">${i}</li>`;
    }
    //list dates of next month (first few days)
    for(let i = lastDayOfMonth; i < 6; i++){
        liTag += `<li class="faded">${i - lastDayOfMonth + 1}</li>`;
    }

    dayTag.innerHTML = liTag;
};
createCalendar();

toggleIcons.forEach(icon => {
    icon.addEventListener("click", () =>{
        //console.log("test click button");
        //if previous clicked decrement month, otherwise increment month for other button
        if(icon.id === "prev"){
            currMonth = currMonth - 1;
        }
        else{
            currMonth += 1;
        }
        //update year if scroll past/before current year
        if(currMonth < 0 || currMonth > 11){
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
        else{
            date = new Date();
        }
        createCalendar();
    });
});