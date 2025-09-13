import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

class AuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
  }

  // Register with email and password
  async register({ email, password, name }) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update user profile
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await this.createUserDocument(user, { name, email });

      // Send email verification
      await sendEmailVerification(user);

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Login with email and password
  async login({ email, password }) {
    try {
      const { user } = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Login with Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(this.auth, provider);

      // Create user document if it doesn't exist
      await this.createUserDocumentIfNotExists(user);

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Update user profile
  async updateUserProfile({ displayName, photoURL }) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await updateProfile(user, { displayName, photoURL });

      // Update Firestore document
      await updateDoc(doc(this.db, "users", user.uid), {
        displayName,
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Change password
  async changePassword({ currentPassword, newPassword }) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Get user document from Firestore
  async getUserDocument(uid) {
    try {
      const userDoc = await getDoc(doc(this.db, "users", uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: "User document not found" };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Create user document in Firestore
  async createUserDocument(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(this.db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date().toISOString();

      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName,
          email,
          photoURL: photoURL || null,
          createdAt,
          updatedAt: createdAt,
          // Role-Based Access Control
          role: additionalData.role || "job_seeker", // Default role
          permissions: this.getRolePermissions(
            additionalData.role || "job_seeker"
          ),
          isActive: true,
          ...additionalData,
        });
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    }
  }

  // Create user document if it doesn't exist (for social login)
  async createUserDocumentIfNotExists(user) {
    const userRef = doc(this.db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await this.createUserDocument(user);
    }
  }

  // Role-Based Access Control Methods
  getRolePermissions(role) {
    const rolePermissions = {
      job_seeker: [
        "profile:edit:own",
        "applications:create",
        "applications:view:own",
        "resume:review",
      ],
      employer: [
        "profile:edit:own",
        "jobs:create",
        "jobs:edit:own",
        "jobs:delete:own",
        "jobs:view:all",
        "applications:view:own_jobs",
      ],
      admin: [
        "profile:edit:own",
        "profile:edit:all",
        "jobs:create",
        "jobs:edit:all",
        "jobs:delete:all",
        "jobs:view:all",
        "users:manage",
        "applications:view:all",
        "system:admin",
      ],
    };

    return rolePermissions[role] || rolePermissions.job_seeker;
  }

  // Check if user has specific permission
  async hasPermission(userId, permission) {
    try {
      const userDoc = await this.getUserDocument(userId);
      if (!userDoc.success) return false;

      const userPermissions = userDoc.data.permissions || [];
      return userPermissions.includes(permission);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId, newRole, adminUserId) {
    try {
      // Check if the admin has permission to manage users
      const hasPermission = await this.hasPermission(
        adminUserId,
        "users:manage"
      );
      if (!hasPermission) {
        return {
          success: false,
          error: "Insufficient permissions to manage users",
        };
      }

      const userRef = doc(this.db, "users", userId);
      const updatedAt = new Date().toISOString();

      await updateDoc(userRef, {
        role: newRole,
        permissions: this.getRolePermissions(newRole),
        updatedAt,
        lastRoleUpdate: {
          date: updatedAt,
          updatedBy: adminUserId,
        },
      });

      return { success: true, message: "User role updated successfully" };
    } catch (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: error.message };
    }
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use":
        "An account already exists with this email address.",
      "auth/weak-password":
        "Password is too weak. Please choose a stronger password.",
      "auth/invalid-email": "Invalid email address format.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Please check your internet connection.",
      "auth/popup-closed-by-user": "Login popup was closed before completion.",
      "auth/popup-blocked": "Login popup was blocked by the browser.",
      "auth/requires-recent-login":
        "Please log out and log back in to perform this action.",
      "auth/invalid-credential":
        "Invalid credentials. Please check your email and password.",
    };

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred. Please try again."
    );
  }
}
export default new AuthService();
