// guard-v10.js — Firebase V10 Modular Permission Guard

import { 
  getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, doc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ORG_ID = "bcd";

// ----------------------------------------------------
// REQUIRE SPECIFIC PERMISSION (KEEP THIS AS IS)
// ----------------------------------------------------
export async function requirePermission(permissionName) {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user) => {

      if (!user) {
        window.location.href = "/admin/login.html";
        return reject("User not logged in");
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          alert("User account data missing.");
          window.location.href = "/";
          return reject("User doc missing");
        }

        const userData = userSnap.data();
        const roleId = userData.roleId;

        if (!roleId) {
          alert("No role assigned to your account.");
          window.location.href = "/";
          return reject("No role assigned");
        }

        const roleRef = doc(db, `organizations/${ORG_ID}/roles/${roleId}`);
        const roleSnap = await getDoc(roleRef);

        if (!roleSnap.exists()) {
          alert("Your role no longer exists.");
          window.location.href = "/";
          return reject("Role not found");
        }

        const role = roleSnap.data();
        const perms = role.permissions || {};

        const allowed = perms.admin === true || perms[permissionName] === true;

        if (!allowed) {
          alert("You do not have permission to access this page.");
          window.location.href = "/";
          return reject("Permission denied");
        }

        resolve({
          user,
          userData,
          role,
          permissions: perms,
        });

      } catch (err) {
        console.error("Guard error:", err);
        alert("Access error. Please try again.");
        window.location.href = "/";
        reject(err);
      }
    });
  });
}


// ----------------------------------------------------
// NEW FUNCTION: REQUIRE AT LEAST 1 PERMISSION
// ----------------------------------------------------
export async function requireAnyPermission() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user) => {

      if (!user) {
        window.location.href = "/admin/login.html";
        return reject("Not logged in");
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          alert("User account missing.");
          window.location.href = "/";
          return reject("User doc missing");
        }

        const userData = userSnap.data();
        const roleId = userData.roleId;

        if (!roleId) {
          alert("No role assigned to your account.");
          window.location.href = "/";
          return reject("No role assigned");
        }

        const roleRef = doc(db, `organizations/${ORG_ID}/roles/${roleId}`);
        const roleSnap = await getDoc(roleRef);

        if (!roleSnap.exists()) {
          alert("Your role no longer exists.");
          window.location.href = "/";
          return reject("Role not found");
        }

        const role = roleSnap.data();
        const perms = role.permissions || {};

        // ⭐ CHECK: Does the role have ANY permission?
        const hasAnyPermission = Object.values(perms).some(v => v === true);

        if (!hasAnyPermission) {
          alert("You do not have access to this area.");
          window.location.href = "/";
          return reject("No permissions at all");
        }

        resolve({
          user,
          userData,
          role,
          permissions: perms,
        });

      } catch (err) {
        console.error("Guard error:", err);
        window.location.href = "/";
        reject(err);
      }
    });
  });
}
