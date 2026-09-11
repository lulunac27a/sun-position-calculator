const latitudeInput = document.getElementById("latitude"); //latitude input field
const longitudeInput = document.getElementById("longitude"); //longitude input field
const monthInput = document.getElementById("month"); //month input field
const dayInput = document.getElementById("day"); //day input field
const yearInput = document.getElementById("year"); //year input field
const hourInput = document.getElementById("hour"); //hour input field
const minuteInput = document.getElementById("minute"); //minute input field
const secondInput = document.getElementById("second"); //second input field
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
    const year = parseInt(yearInput.value, 10); //parse input values to integer
    const month = parseInt(monthInput.value, 10);
    const day = parseInt(dayInput.value, 10);
    const hour = parseInt(hourInput.value, 10);
    const minute = parseInt(minuteInput.value, 10);
    const second = parseInt(secondInput.value, 10);

    const JD = dateToJulianDate(year, month, day, hour, minute, second); //convert date and time to Julian date
    const T = (JD - 2451545.0) / 36525.0; //calculate Julian centuries since J2000.0

    // Calculate the Sun's mean longitude
    const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360; //mean longitude of the sun

    // Calculate the Sun's mean anomaly
    const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360; //mean anomaly of the sun

    // Calculate the Sun's equation of center
    const C =
        (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
        (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
        0.000289 * Math.sin(degToRad(3 * M)); //equation of center of the sun

    // Calculate the Sun's true longitude
    const trueLongitude = L0 + C; //true longitude of the sun

    // Calculate the Sun's apparent longitude
    const omega = 125.04 - 1934.136 * T; //longitude of the ascending node of the moon's mean orbit on the ecliptic
    const lambda =
        trueLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega)); //apparent longitude of the sun

    // Calculate the Sun's right ascension and declination
    const epsilon = 23.439292 - 0.013004167 * T;
    const alpha = radToDeg(
        Math.atan2(
            Math.cos(degToRad(epsilon)) * Math.sin(degToRad(lambda)),
            Math.cos(degToRad(lambda)),
        ),
    ); //right ascension of the sun
    const delta = radToDeg(
        Math.asin(Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))),
    ); //declination of the sun

    // Calculate the Sun's local hour angle
    const H = (hour + minute / 60 + second / 3600) * 15 - longitude - alpha; //local hour angle of the sun

    // Calculate the Sun's altitude and azimuth
    const altitude = radToDeg(
        Math.asin(
            Math.sin(latitudeRad) * Math.sin(degToRad(delta)) +
                Math.cos(latitudeRad) *
                    Math.cos(degToRad(delta)) *
                    Math.cos(degToRad(H)),
        ),
    ); //altitude of the sun
    const azimuth = radToDeg(
        Math.atan2(
            -Math.sin(degToRad(H)),
            Math.cos(latitudeRad) * Math.tan(degToRad(delta)) -
                Math.sin(latitudeRad) * Math.cos(degToRad(H)),
        ),
    ); //azimuth of the sun

    // Display the results
    document.getElementById("altitude").textContent =
        `Altitude: ${altitude.toFixed(2)}°`; //display altitude of the sun
    document.getElementById("azimuth").textContent =
        `Azimuth: ${azimuth.toFixed(2)}°`; //display azimuth of the sun
}
function dateToJulianDate(year, month, day, hour, minute, second) {
    //function to convert date and time to Julian date
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD =
        Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day +
        B -
        1524.5 +
        (hour + minute / 60 + second / 3600) / 24;
    return JD;
}
