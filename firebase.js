// 1. Configure Firebase (You get these keys from the Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC-qUsW2JmjDkcLfB1W7kT-jQtxFi6VfEk",
  authDomain: "matt-vault-app.firebaseapp.com",
  projectId: "matt-vault-app",
  storageBucket: "matt-vault-app.firebasestorage.app",
  messagingSenderId: "435451171052",
  appId: "1:435451171052:web:9643b9194436f8691f95c9",
};

// 2. Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const linksCol = collection(db, "userLinks");

export const fetchData = async () => {
  const data = await getDocs(linksCol, "userLinks");

  const allSites = [];
  data.forEach((doc) => {
    allSites.push(doc.data());
  });
  const d = await Promise.all(allSites);
  return d;
};

// 3. Function to Add a Link
async function addLink(title, url) {
  try {
    const docRef = await addDoc(linksCol, {
      title: title,
      url: url,
      timestamp: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
    renderLinks(); // Refresh the list
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// 4. Function to Edit an Existing Link
async function editLink(id, newTitle, newUrl) {
  const linkRef = doc(db, "userLinks", id);
  await updateDoc(linkRef, {
    title: newTitle,
    url: newUrl,
  });
  renderLinks();
}

// Grab the buttons from your HTML
const saveButton = document.getElementById("addStudioBtn");
const titleField = document.getElementById("newStudioName");
const urlField = document.getElementById("newStudioUrl");

// The "Listener" (This is the magic part)
saveButton.addEventListener("click", async () => {
  // Pull the text currently sitting inside your boxes
  const userTitle = titleField.value;
  const userUrl = urlField.value;

  if (userTitle === "" || userUrl === "") {
    alert("Please fill out both fields!");
    return;
  }

  // Call the Firebase function to send it to the cloud
  try {
    await addLink(userTitle, userUrl);
    alert("Successfully saved to your database!");

    // Optional: Clear the boxes after saving
    titleField.value = "";
    urlField.value = "";
  } catch (error) {
    console.error("Database Error:", error);
  }
});
