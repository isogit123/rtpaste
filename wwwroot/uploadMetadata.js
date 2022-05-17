function getRemainingTimeInSeconds(timeStarted, loaded, total) {
    return (total - loaded) / getSpeed(loaded, timeStarted)
}

function getSpeed(loaded, timeStarted) {
    timeElapsed = (new Date()) - timeStarted; // Assuming that timeStarted is a Date Object
    return loaded / (timeElapsed / 1000); // Upload speed in second
}

function getSpeedStr(loaded, timeStarted) {
    let speed = getSpeed(loaded, timeStarted)
    let divisionCount = 0
    while (speed > 1) {
        speed /= 1024
        divisionCount++
    }
    speed *= 1024
    speed = parseInt(speed)
    divisionCount--
    switch (divisionCount) {
        case 0: return speed + ' B/s'
        case 1: return speed + ' KB/s'
        case 2: return speed + ' MB/s'
        case 3: return speed + ' GB/s'
        case 4: return speed + ' TB/s'
        default: return speed
    }
}

function convertHMS(timeStarted, loaded, total) {
    let value = getRemainingTimeInSeconds(timeStarted, loaded, total)
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
}