const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const monthInput = document.getElementById('month');
const dayInput = document.getElementById('day');
const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad * (180 / Math.PI);
const calculateButton = document.getElementById('calculate');
calculateButton.addEventListener('click', calculateSunPosition);
function calculateSunPosition() {
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);
    const latitudeRad = degToRad(latitude);
    const longitudeRad = degToRad(longitude);
    const month = parseInt(monthInput.value, 10);
    const day = parseInt(dayInput.value, 10);
    const hour = parseInt(hourInput.value, 10);
    const minute = parseInt(minuteInput.value, 10);
    const dayOfYear = getDayOfYear(month, day);
    const eqOfTime = calculateEquationOfTime(dayOfYear);
    const solarDeclination = calculateSolarDeclination(dayOfYear);
    const timeOffset = eqOfTime + 4 * longitude - 60 * 0; // Assuming UTC offset is 0
    const trueSolarTime = (hour * 60 + minute + timeOffset) % 1440;
    const hourAngle = degToRad((trueSolarTime / 4) - 180);
    const altitude = radToDeg(Math.asin(Math.sin(latitudeRad) * Math.sin(degToRad(solarDeclination)) +
        Math.cos(latitudeRad) * Math.cos(degToRad(solarDeclination)) * Math.cos(hourAngle)));
    const azimuth = radToDeg(Math.atan2(-Math.sin(hourAngle),
        Math.cos(latitudeRad) * Math.tan(degToRad(solarDeclination)) -
        Math.sin(latitudeRad) * Math.cos(hourAngle)));
    // Display the results
    document.getElementById('altitude').textContent = `Altitude: ${altitude.toFixed(2)}°`;
    document.getElementById('azimuth').textContent = `Azimuth: ${azimuth.toFixed(2)}°`;
}
function getDayOfYear(month, day) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayOfYear = 0;
    for (let i = 0; i < month - 1; i++) {
        dayOfYear += daysInMonth[i];
    }
    dayOfYear += day;
    return dayOfYear;
}
function calculateEquationOfTime(dayOfYear) {
    const B = degToRad((360 / 365) * (dayOfYear - 81));
    return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
function calculateSolarDeclination(dayOfYear) {
    return 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81)));
}