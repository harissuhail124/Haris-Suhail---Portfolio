import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from "./js/firebase.js";

const loginBox = document.getElementById("login-box");
const dashboardBox = document.getElementById("dashboard-box");
const loginForm = document.getElementById("login-form");
const blogForm = document.getElementById("blog-form");
const logoutBtn = document.getElementById("logout-btn");

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBox) loginBox.classList.add("hidden");
    if (dashboardBox) dashboardBox.classList.remove("hidden");
  } else {
    if (loginBox) loginBox.classList.remove("hidden");
    if (dashboardBox) dashboardBox.classList.add("hidden");
  }
});

// Handle Login Submission
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully!");
    } catch (err) {
      console.error("Login Error:", err.code, err.message);
      alert(`Login failed: ${err.message}`);
    }
  });
}

// Handle Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).catch((err) => console.error("Logout error:", err));
  });
}

// Handle Blog Post Submission
if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("blog-title").value;
    const content = document.getElementById("blog-content").value;

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        createdAt: serverTimestamp(),
        author: auth.currentUser ? auth.currentUser.email : "admin"
      });
      alert("Blog published successfully!");
      blogForm.reset();
    } catch (err) {
      console.error("Firestore Error:", err);
      alert(`Error publishing blog: ${err.message}`);
    }
  });
}