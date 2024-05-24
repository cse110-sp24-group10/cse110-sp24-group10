const monthYear = document.querySelector(".monthANDyear");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
//console.log(date, currYear, currMonth);

const renderCalendar = () => {
    monthYear.innerText = `${currMonth} ${currYear}`;
}
renderCalendar();