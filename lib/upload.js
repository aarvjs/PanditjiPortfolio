import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Uploads an image file to Firebase Storage under a specified folder.
 * Falls back to returning a base64 Data URL if Firebase is not configured.
 * 
 * @param {File} file - The file to upload
 * @param {string} folder - The storage directory folder
 * @returns {Promise<{ downloadUrl: string, storagePath: string }>}
 */
export async function uploadImage(file, folder = "general") {
  if (!file) throw new Error("No file provided");
  
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  // Fallback to Data URL for Mock Mode
  if (!storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          downloadUrl: reader.result,
          storagePath: `mock/${folder}/${Date.now()}_${file.name}`
        });
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
  
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop() || "jpg";
  const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const storagePath = `${folder}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  return { downloadUrl, storagePath };
}

/**
 * Deletes an image from Firebase Storage using its storage path.
 * 
 * @param {string} storagePath - The path in Firebase Storage
 * @returns {Promise<void>}
 */
export async function deleteImage(storagePath) {
  if (!storagePath || storagePath.startsWith("mock/")) return;
  if (!storage) return;
  
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    // If file already deleted or doesn't exist, ignore or log
    console.error("Error deleting image from storage:", error);
  }
}

/**
 * Uploads a document (PDF, eBook, or Image) to Firebase Storage under a specified folder.
 * Falls back to returning a base64 Data URL if Firebase is not configured.
 * 
 * @param {File} file - The file to upload
 * @param {string} folder - The storage directory folder
 * @returns {Promise<{ downloadUrl: string, storagePath: string }>}
 */
export async function uploadDocument(file, folder = "documents") {
  if (!file) throw new Error("No file provided");
  
  // Validate file type (allow PDF and images)
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type) && !file.type.startsWith("image/")) {
    throw new Error("Only PDF and image files are allowed");
  }
  
  // Validate file size (25MB limit for books)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 25MB");
  }

  // Fallback to Data URL for Mock Mode
  if (!storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          downloadUrl: reader.result,
          storagePath: `mock/${folder}/${Date.now()}_${file.name}`
        });
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
  
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop() || "pdf";
  const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const storagePath = `${folder}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  return { downloadUrl, storagePath };
}
