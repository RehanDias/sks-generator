// Fungsi untuk mengambil data JSON
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fungsi untuk mendapatkan sks SI secara acak
const getRandomSICourses = (data) => {
  let randomSICourses = [];
  let totalSKS = 0;
  const siCourses = data.filter((course) => course["JURUSAN "] === "SI");

  // Fungsi untuk memeriksa apakah waktu sks unik
  const isUniqueTime = (selectedCourses, newCourse) => {
    return !selectedCourses.some((course) => course.WAKTU === newCourse.WAKTU);
  };

  // Fungsi untuk memeriksa apakah nama mata kuliah unik
  const isUniqueCourse = (selectedCourses, newCourse) => {
    return !selectedCourses.some(
      (course) => course["NAMA MATA KULIAH"] === newCourse["NAMA MATA KULIAH"]
    );
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
      isUniqueTime(randomSICourses, randomCourse) &&
      isUniqueCourse(randomSICourses, randomCourse)
    ) {
      randomSICourses.push(randomCourse);
      totalSKS += parseInt(randomCourse.SKS);
    }
    siCourses.splice(randomIndex, 1);
  }

  return randomSICourses;
};

// Variabel global untuk melacak apakah notifikasi telah ditampilkan
let notificationDisplayed = false;

// Fungsi untuk merender sks pada halaman web
const renderCourses = (courses) => {
  const coursesBody = document.getElementById("courseDetailsBody");
  coursesBody.innerHTML = ""; // Hapus sks yang ada

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

  // Tampilkan div dengan id 'courses'
  document.getElementById("courses").style.display = "block";

  // Tambahkan teks notifikasi hanya jika belum ditampilkan sebelumnya
  if (!notificationDisplayed) {
    const notificationContainer = document.getElementById(
      "notificationContainer"
    );
    const notification = document.createElement("div");
    notification.textContent =
      "Catatan: Jam malam dalam data telah diubah menjadi 21:30, berbeda dari WEB-SIA (21:10 dan 22:00).";
    notification.style.color = "red";
    notification.style.fontWeight = "bold"; // Buat teks tebal
    notification.style.marginBottom = "30px"; // Sesuaikan margin untuk jarak
    notificationContainer.appendChild(notification); // Masukkan notifikasi ke dalam kontainer
    notificationDisplayed = true; // Tandai notifikasi telah ditampilkan
  }
};

// Event listener untuk tombol "Dapatkan Random Course"
document.getElementById("randomButton").addEventListener("click", async () => {
  const dataUrl = "./dataPlus5.json"; // URL ke file data JSON
  const jsonData = await fetchData(dataUrl);
  const newCourses = getRandomSICourses(jsonData);
  renderCourses(newCourses);

  // Hapus gaya CSS dari #randomButtonContainer setelah tombol diklik
  document.getElementById("randomButtonContainer").style.marginTop = "0";
});
