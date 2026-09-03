const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const monthInput = document.getElementById('month');
const dayInput = document.getElementById('day');
const yearInput = document.getElementById('year');
const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const secondInput = document.getElementById('second');
const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad * (180 / Math.PI);
const calculateButton = document.getElementById('calculate');
calculateButton.addEventListener('click', calculateSunPosition);
function calculateSunPosition() {
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);
    const latitudeRad = degToRad(latitude);
    const longitudeRad = degToRad(longitude);
    const year = parseInt(yearInput.value);
    const month = parseInt(monthInput.value);
    const day = parseInt(dayInput.value);
    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);
    const second = parseInt(secondInput.value);

    const JD = dateToJulianDate(year, month, day, hour, minute, second);
    const T = (JD - 2451545.0) / 36525.0;

    // Calculate the Sun's mean longitude
    const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;

    // Calculate the Sun's mean anomaly
    const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;

    // Calculate the Sun's equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
        (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
        0.000289 * Math.sin(degToRad(3 * M));

    // Calculate the Sun's true longitude
    const trueLongitude = L0 + C;

    // Calculate the Sun's apparent longitude
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega));

    // Calculate the Sun's right ascension and declination
    const epsilon = 23.439292 - 0.013004167 * T;
    const alpha = radToDeg(Math.atan2(Math.cos(degToRad(epsilon)) * Math.sin(degToRad(lambda)), Math.cos(degToRad(lambda))));
    const delta = radToDeg(Math.asin(Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))));

    // Calculate the Sun's local hour angle
    const H = (hour + minute / 60 + second / 3600) * 15 - longitude - alpha;

    // Calculate the Sun's altitude and azimuth
    const altitude = radToDeg(Math.asin(Math.sin(latitudeRad) * Math.sin(degToRad(delta)) +
        Math.cos(latitudeRad) * Math.cos(degToRad(delta)) * Math.cos(degToRad(H))));
    const azimuth = radToDeg(Math.atan2(-Math.sin(degToRad(H)),
        Math.cos(latitudeRad) * Math.tan(degToRad(delta)) -
        Math.sin(latitudeRad) * Math.cos(degToRad(H))));

    // Display the results
    document.getElementById('altitude').textContent = `Altitude: ${altitude.toFixed(2)}°`;
    document.getElementById('azimuth').textContent = `Azimuth: ${azimuth.toFixed(2)}°`;
}
function dateToJulianDate(year, month, day, hour, minute, second) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day + B - 1524.5 +
        (hour + minute / 60 + second / 3600) / 24;
    return JD;
}