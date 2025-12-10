// guard.js — Universal Permission Guard for BCD Admin Panel

// IMPORTANT:
// - Load AFTER Firebase init (firebase.initializeApp)
// - Works with Firestore roles system at: organizations/bcd/roles/{roleId}
// - Use on every admin page:
//      await requirePermission("manageCourses");
//
// - Permissions supported:
//      admin
//      manageUsers
//      manageRoles
//      manageCourses
//      manageSubjects
//      manageContent
//      manageDoubts
//      manageExams

const ORG_ID = "bcd"; // Change only if your org ID changes

async function requirePermission(permissionName) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async (user) => {

      if (!user) {
        window.location.href = "/admin/login.html";
        return reject("User not logged in");
      }

      try {
        // -----------------------------
        // (1) Load user document
        // -----------------------------
        const userDoc = await firebase.firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (!userDoc.exists) {
          alert("User account data missing.");
          window.location.href = "/";
          return reject("User doc missing");
        }

        const userData = userDoc.data();
        const roleId = userData.roleId;

        if (!roleId) {
          alert("No role assigned to your account.");
          window.location.href = "/";
          return reject("No roleId");
        }

        // -----------------------------
        // (2) Load role document
        // -----------------------------
        const roleSnap = await firebase.firestore()
          .collection("organizations")
          .doc(ORG_ID)
          .collection("roles")
          .doc(roleId)
          .get();

        if (!roleSnap.exists) {
          alert("Your role no longer exists.");
          window.location.href = "/";
          return reject("Role not found");
        }

        const role = roleSnap.data();
        const perms = role.permissions || {};

        // -----------------------------
        // (3) Permission check
        // Admin override → full access
        // -----------------------------
        const allowed = perms.admin === true || perms[permissionName] === true;

        if (!allowed) {
          alert("You do not have permission to access this page.");
          window.location.href = "/";
          return reject("Permission denied");
        }

        // -----------------------------
        // (4) SUCCESS → return data
        // -----------------------------
        resolve({
          user,
          userData,
          role,
          permissions: perms
        });

      } catch (err) {
        console.error("Guard Error:", err);
        alert("Access error. Please try again.");
        window.location.href = "/";
        reject(err);
      }
    });
  });
}
