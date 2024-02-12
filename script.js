// Function to fetch JSON data
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Function to get random SI courses
const getRandomSICourses = (data) => {
  let randomSICourses = [];
  let totalSKS = 0;
  const siCourses = data.filter((course) => course["JURUSAN "] === "SI");

  const isUniqueTime = (selectedCourses, newCourse) => {
    return !selectedCourses.some((course) => course.WAKTU === newCourse.WAKTU);
  };

  while (
    randomSICourses.length < 6 &&
    siCourses.length > 0 &&
    (totalSKS < 17 || totalSKS > 21)
  ) {
    const randomIndex = Math.floor(Math.random() * siCourses.length);
    const randomCourse = siCourses[randomIndex];
    if (
      !randomCourse["NAMA MATA KULIAH"].includes("AGAMA") &&
      isUniqueTime(randomSICourses, randomCourse)
    ) {
      randomSICourses.push(randomCourse);
      totalSKS += parseInt(randomCourse.SKS);
    }
    siCourses.splice(randomIndex, 1);
  }

  return randomSICourses;
};

// Function to render courses on the webpage
const renderCourses = (courses) => {
  const coursesBody = document.getElementById("courseDetailsBody");
  coursesBody.innerHTML = ""; // Clear existing courses

  courses.forEach((course) => {
    const row = coursesBody.insertRow();
    row.innerHTML = `
      <td>${course["KODE "]}</td>
      <td>${course["NAMA MATA KULIAH"]}</td>
      <td>${course.SKS}</td>
      <td>${course.KELAS}</td>
      <td>${course.WAKTU}</td>
      <td>${course.RUANG}</td>
    `;
  });

  // Menampilkan div dengan id 'courses'
  document.getElementById("courses").style.display = "block";
};

// Event listener for the "Dapatkan Random Course" button
document.getElementById("randomButton").addEventListener("click", async () => {
  const dataUrl = "dataPlus5.json"; // URL to your JSON data file
  const jsonData = await fetchData(dataUrl);
  const newCourses = getRandomSICourses(jsonData);
  renderCourses(newCourses);

  // Menghapus gaya CSS dari #randomButtonContainer setelah tombol diklik
  document.getElementById("randomButtonContainer").style.marginTop = "0";
});
