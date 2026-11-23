import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "./js/firebase.js"; // Adjust path if firebase.js is inside a folder (e.g. "./lib/firebase.js" or "../firebase.js")

async function loadBlogs() {
  const container = document.getElementById("blogs-container");
  if (!container) return; // Exit gracefully if the blog section isn't on this specific page

  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      container.innerHTML = `<p class="text-gray-400">No blog posts published yet.</p>`;
      return;
    }

    let htmlContent = "";
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now';
      
      htmlContent += `
        <article class="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-md mb-4">
          <h3 class="text-xl font-semibold text-white mb-2">${post.title}</h3>
          <p class="text-sm text-gray-400 mb-4">${date}</p>
          <p class="text-gray-300 whitespace-pre-wrap">${post.content}</p>
        </article>
      `;
    });
    
    container.innerHTML = htmlContent;
    console.log("Blogs loaded successfully.");
  } catch (err) {
    console.error("Error loading blogs from Firestore:", err);
  }
}

// Run when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadBlogs();
});