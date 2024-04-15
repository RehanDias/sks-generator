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

// Fungsi untuk mendapatkan sks SI secara acak dengan algoritma pengacakan Fisher-Yates (shuffle)
const getRandomSICourses = (data) => {
   let randomSICourses = [];
   let totalSKS = 0;
   const siCourses = data.filter((course) => course["JURUSAN "] === "SI");

   // Algoritma pengacakan Fisher-Yates (shuffle)
   const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
   };

   // Shuffle array of SI courses
   shuffleArray(siCourses);

   const isUniqueTime = (selectedCourses, newCourse) => {
      return !selectedCourses.some(
         (course) => course.WAKTU === newCourse.WAKTU
      );
   };

   const isUniqueCourse = (selectedCourses, newCourse) => {
      return !selectedCourses.some(
         (course) =>
            course["NAMA MATA KULIAH"] === newCourse["NAMA MATA KULIAH"]
      );
   };

   for (const course of siCourses) {
      if (
         !course["NAMA MATA KULIAH"].includes("AGAMA") &&
         isUniqueTime(randomSICourses, course) &&
         isUniqueCourse(randomSICourses, course) &&
         totalSKS < 17
      ) {
         randomSICourses.push(course);
         totalSKS += parseInt(course.SKS);
      }
      if (randomSICourses.length >= 6 || totalSKS >= 17) {
         break;
      }
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

   // Validasi data JSON
   if (!Array.isArray(jsonData) || jsonData.length === 0) {
      console.error("Data JSON tidak valid atau kosong.");
      return;
   }

   const newCourses = getRandomSICourses(jsonData);
   renderCourses(newCourses);

   // Hapus gaya CSS dari #randomButtonContainer setelah tombol diklik
   document.getElementById("randomButtonContainer").style.marginTop = "0";
});
