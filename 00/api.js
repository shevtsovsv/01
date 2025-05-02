console.log(234);

fetch("https://24.objects.htmlacademy.pro/big-trip/points", {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: "Basic dXNlcjoxMjM=",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Данные:", data);
  })
  .catch((error) => {
    console.error("Ошибка запроса:", error);
  });

fetch("https://24.objects.htmlacademy.pro/big-trip/destinations", {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: "Basic dXNlcjoxMjM=",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Данные:", data);
  })
  .catch((error) => {
    console.error("Ошибка запроса:", error);
  });
