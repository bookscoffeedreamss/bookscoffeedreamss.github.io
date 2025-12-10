// Replace with your own Firebase config:
const firebaseConfig = {
  apiKey: "AIzaSyCJQOWy3dDMguqn7jTAgSO7YyOCuuywO2Y",
  authDomain: "bcd-discord-staff-application.firebaseapp.com",
  projectId: "bcd-discord-staff-application",
  storageBucket: "bcd-discord-staff-application.firebasestorage.app",
  messagingSenderId: "432620310583",
  appId: "1:432620310583:web:b1ebba74c1e29638d6efb2",
  measurementId: "G-QMZCYH5S03"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('staffForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    username: form.username.value,
    discordTag: form.discordTag.value,
    age: form.age.value,
    experience: form.experience.value,
    reason: form.reason.value,
    submittedAt: new Date().toISOString()
  };

  db.collection('staffApplications').add(data)
    .then(() => {
      document.getElementById('successMsg').innerText = "💜 Application submitted successfully!";
      form.reset();
    })
    .catch(err => {
      alert("Error: " + err.message);
    });
});

