const latitudeInput = document.getElementById("latitude"); //latitude input field
const longitudeInput = document.getElementById("longitude"); //longitude input field
const monthInput = document.getElementById("month"); //month input field
const dayInput = document.getElementById("day"); //day input field
const hourInput = document.getElementById("hour"); //hour input field
const minuteInput = document.getElementById("minute"); //minute input field
const degToRad = (deg) => deg * (Math.PI / 180); //function to convert degrees to radians
const radToDeg = (rad) => rad * (180 / Math.PI); //function to convert radians to degrees
const calculateButton = document.getElementById("calculate"); //calculate button
calculateButton.addEventListener("click", calculateSunPosition); //calculate sun position when calculate button is clicked
function calculateSunPosition() {
    //function to calculate sun position
    const latitude = parseFloat(latitudeInput.value); //parse input values to float
    const longitude = parseFloat(longitudeInput.value);
    const latitudeRad = degToRad(latitude); //convert latitude to radians
    const longitudeRad = degToRad(longitude); //convert longitude to radians
    const month = parseInt(monthInput.value, 10); //parse input values to integer
    const day = parseInt(dayInput.value, 10);
    const hour = parseInt(hourInput.value, 10);
    const minute = parseInt(minuteInput.value, 10);
    const dayOfYear = getDayOfYear(month, day); //calculate day of the year
    const eqOfTime = calculateEquationOfTime(dayOfYear); //calculate equation of time
    const solarDeclination = calculateSolarDeclination(dayOfYear); //calculate solar declination
    const timeOffset = eqOfTime + 4 * longitude - 60 * 0; // Assuming UTC offset is 0
    const trueSolarTime = (hour * 60 + minute + timeOffset) % 1440; //calculate true solar time
    const hourAngle = degToRad(trueSolarTime / 4 - 180); //calculate hour angle in radians
    const altitude = radToDeg(
        Math.asin(
            Math.sin(latitudeRad) * Math.sin(degToRad(solarDeclination)) +
            Math.cos(latitudeRad) *
            Math.cos(degToRad(solarDeclination)) *
            Math.cos(hourAngle),
        ),
    ); //calculate altitude of the sun
    const azimuth = radToDeg(
        Math.atan2(
            -Math.sin(hourAngle),
            Math.cos(latitudeRad) * Math.tan(degToRad(solarDeclination)) -
            Math.sin(latitudeRad) * Math.cos(hourAngle),
        ),
    ); //calculate azimuth of the sun
    // Display the results
    document.getElementById("altitude").textContent =
        `Altitude: ${altitude.toFixed(2)}°`; //display altitude of the sun
    document.getElementById("azimuth").textContent =
        `Azimuth: ${azimuth.toFixed(2)}°`; //display azimuth of the sun
}
function getDayOfYear(month, day) {
    //function to calculate day of the year
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //array of days in each month
    let dayOfYear = 0; //initialize day of the year
    for (let i = 0; i < month - 1; i++) {
        //loop through months to calculate day of the year
        dayOfYear += daysInMonth[i]; //add days in each month to day of the year
    }
    dayOfYear += day; //add days in the current month to day of the year
    return dayOfYear; //return day of the year
}
function calculateEquationOfTime(dayOfYear) {
    //function to calculate equation of time
    const B = degToRad((360 / 365) * (dayOfYear - 81));
    return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); //calculate equation of time in minutes
}
function calculateSolarDeclination(dayOfYear) {
    //function to calculate solar declination
    return 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81))); //calculate solar declination in degrees
}
