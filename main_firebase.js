const firebaseConfig = {
  apiKey: "AIzaSyACEG_4v-3ROgMNOlFZsAllC9VcYb8Nm2A",
  authDomain: "bcd-discord.firebaseapp.com",
  projectId: "bcd-discord",
  storageBucket: "bcd-discord.firebasestorage.app",
  messagingSenderId: "278895155371",
  appId: "1:278895155371:web:177a468f5fa3f0abfe3fee",
  measurementId: "G-6Q46Z9ZF0D"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userPic = document.getElementById("userPic");
const userName = document.getElementById("userName");

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      userPic.src = user.photoURL;
      userName.textContent = user.displayName;
      userInfo.style.display = "block";
      loginBtn.style.display = "none";
    })
    .catch(error => {
      alert("Login Failed: " + error.message);
    });
});

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    userInfo.style.display = "none";
    loginBtn.style.display = "inline-block";
  });
});
