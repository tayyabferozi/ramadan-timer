window.onload = async () => {
  // GETTING USER'S LOCATION
  let i = 0;
  for (const key1 in data) {
    data[key1].splice(1, 0, ...data2[key1].splice(0, 8));

    i += 1;
  }

  const getCoords = async () => {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      lon: pos.coords.longitude,
      lat: pos.coords.latitude,
    };
  };

  let nearestArr = [];

  let loc1 = await getCoords();

  // alert(navigator.geolocation);

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
  }

  // GETTING DISTANCE FROM ALL AVAILABLE CITIES

  for (const key in data) {
    let loc2 = { lat: data[key][0].lon, lon: data[key][0].lat };
    nearestArr.push({
      city: key,
      distance: +calDistance(+loc1.lat, +loc2.lat, +loc2.lon, loc1.lon),
      lat: loc2.lat,
      lon: loc2.lon,
    });
  }

  // GETTING THE NEAREST CITY

  let nearestCity = nearestArr.reduce((prev, curr) =>
    prev.distance < curr.distance ? prev : curr
  );

  // UPDATING THE CITY NAME IN UI

  document.getElementById("city-name").innerHTML = nearestCity.city;

  // CREATING THE ACTUAL TIMER

  let cityCal = data[nearestCity.city];

  const foundIndex = cityCal.findIndex((el, idx) => {
    if (idx === 0) return false;
    const d1Time = new Date(el.date + " " + el.seher).getTime();
    const d2Time = new Date(el.date + " " + el.iftar).getTime();
    const d3Time = new Date().getTime();

    const distanceFromSeher = d1Time - d3Time;
    const distanceFromIFtar = d2Time - d3Time;

    return distanceFromSeher > 0 || distanceFromIFtar > 0;
  });
  let dayData = cityCal[foundIndex];
  let seherTime = dayData.seher.split(" AM")[0];
  let iftarTime = dayData.iftar.split(" PM")[0];
  let calDate = dayData.date;
  let splitSeherTime = seherTime.split(":");
  let splitIftarTime = iftarTime.split(":");
  let splitDate = calDate.split(" ");
  let seherHour = splitSeherTime[0];
  let seherMin = splitSeherTime[1];
  let iftarHour = +splitIftarTime[0] + 12;
  let iftarMin = splitIftarTime[1];
  let calDD = splitDate[0];
  let calMM = splitDate[1];
  let calYYYY = splitDate[2];

  let seherTimeObj = new Date(
    `${calMM} ${calDD}, ${calYYYY} ${seherHour}:${seherMin}`
  );

  let iftarTimeObj = new Date(
    `${calMM} ${calDD}, ${calYYYY} ${iftarHour}:${iftarMin}`
  );

  // let seherElement = document.getElementById("seher-timer");
  // let iftarElement = document.getElementById("iftar-timer");

  let seherElement = document.querySelector(".timer-title.seher");
  let iftarElement = document.querySelector(".timer-title.iftar");

  createTimer(seherTimeObj, seherElement, "seher");
  createTimer(iftarTimeObj, iftarElement, "iftar");

  setInterval(function () {
    let now = new Date();
    document.getElementById(
      "city-timer"
    ).innerHTML = `${now.getHours()}: ${now.getMinutes()}: ${now.getSeconds()}`;
  }, 1000);

  // setInterval(function () {
  //   if (seherElement.style.display !== "none") {
  //     seherElement.style.display = "none";
  //   } else {
  //     seherElement.style.display = "block";
  //   }
  // }, 0);

  function getParsedTime(time) {
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  }

  function createTimer(time, element, text) {
    // Set the date we're counting down to
    let countDownDate = new Date(time).getTime();

    // Update the count down every 1 second
    let timerInterval = setInterval(function () {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = countDownDate - now;

      let [days, hours, minutes, seconds] = getParsedTime(distance);

      // Output the result in an element with id="demo"
      // element.innerHTML =
      //   days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      element.innerHTML = `${hours} hr ${minutes} min ${seconds} sec remaining for ${text}`;
      // days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      // 15 MIN FUNCTIONALITY

      // if (hours > 0) {
      //   element.style.display = "none";
      // } else if (minutes > 14) {
      //   element.style.display = "none";
      // } else {
      //   element.style.display = "block";
      // }

      // TEMPORARY LINES

      if (seherElement.style.display !== "none") {
        iftarElement.style.display = "none";
      } else {
        iftarElement.style.display = "block";
      }

      if (iftarElement.style.display !== "none") {
        seherElement.style.display = "none";
      } else {
        seherElement.style.display = "block";
      }

      // TEMPORARY LINES END

      // STOP TIMER WHEN TIME IS PASSED

      if (distance < 0) {
        clearInterval(timerInterval);
        element.style.display = "none";
      }
    }, 1000);
  }

  // TO CALCULATE DISTANCE BETWEEN TWO POINTS ON EARTH

  function calDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};
