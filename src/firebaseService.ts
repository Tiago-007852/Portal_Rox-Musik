import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  increment,
  writeBatch,
  getDocFromServer
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { Post, SiteConfig, Category } from "./types";
import { DEFAULT_CONFIG, DEFAULT_CATEGORIES, SEED_POSTS } from "./seedData";

// Validate connection on boot
export async function testFirebaseConnection() {
  try {
    const testDocRef = doc(db, "test", "connection");
    await getDocFromServer(testDocRef);
    console.log("Firebase connection verified and active!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration. The client is offline.");
    }
  }
}

// Reusable helper to clean undefined fields before sending to Firestore, preventing SDK crash
function cleanUndefined<T extends object>(obj: T): T {
  const clean: any = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (val !== undefined) {
      if (val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = cleanUndefined(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean as T;
}

// 1. SITE CONFIGURATION SYNC
export async function fetchSiteConfig(): Promise<SiteConfig> {
  const path = "config/site";
  const configDocRef = doc(db, "config", "site");
  
  let docSnap;
  try {
    docSnap = await getDoc(configDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return DEFAULT_CONFIG;
  }

  if (docSnap.exists()) {
    return docSnap.data() as SiteConfig;
  } else {
    // Attempt to seed first-time configuration (requires admin credentials)
    try {
      await setDoc(configDocRef, DEFAULT_CONFIG);
    } catch (writeError) {
      console.warn("Could not seed initial site configuration to server (requires administrator privileges). Using offline default config.");
    }
    return DEFAULT_CONFIG;
  }
}

export async function saveSiteConfig(updatedConfig: SiteConfig): Promise<void> {
  const path = "config/site";
  try {
    const configDocRef = doc(db, "config", "site");
    await setDoc(configDocRef, cleanUndefined(updatedConfig));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. CATEGORIES SYNC
export async function fetchCategories(): Promise<Category[]> {
  const collectionPath = "categories";
  const catColRef = collection(db, collectionPath);
  
  let snapshot;
  try {
    snapshot = await getDocs(catColRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return DEFAULT_CATEGORIES;
  }

  if (!snapshot.empty) {
    const cats: Category[] = [];
    snapshot.forEach((docSnap) => {
      cats.push(docSnap.data() as Category);
    });
    return cats;
  } else {
    // Attempt to seed categories (requires admin credentials)
    try {
      const list: Category[] = [];
      const batch = writeBatch(db);
      for (const cat of DEFAULT_CATEGORIES) {
        const docRef = doc(db, collectionPath, cat.id);
        batch.set(docRef, cat);
        list.push(cat);
      }
      await batch.commit();
    } catch (writeError) {
      console.warn("Could not seed initial categories to server (requires administrator privileges). Using offline default categories.");
    }
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategory(catId: string, updatedData: Partial<Category>): Promise<void> {
  const path = `categories/${catId}`;
  try {
    const catDocRef = doc(db, "categories", catId);
    await updateDoc(catDocRef, cleanUndefined(updatedData));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 3. POSTS SYNC
export async function fetchPosts(): Promise<Post[]> {
  const collectionPath = "posts";
  const postsColRef = collection(db, collectionPath);
  
  let snapshot;
  try {
    snapshot = await getDocs(postsColRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return SEED_POSTS;
  }

  if (!snapshot.empty) {
    const postsList: Post[] = [];
    snapshot.forEach((docSnap) => {
      postsList.push(docSnap.data() as Post);
    });
    return postsList.sort((a, b) => b.data.localeCompare(a.data));
  } else {
    // Attempt to seed music posts (requires admin credentials)
    try {
      const batch = writeBatch(db);
      for (const p of SEED_POSTS) {
        const docRef = doc(db, collectionPath, p.id);
        batch.set(docRef, p);
      }
      await batch.commit();
    } catch (writeError) {
      console.warn("Could not seed initial posts to server (requires administrator privileges). Using offline default posts.");
    }
    return SEED_POSTS;
  }
}

export async function createPostInFirestore(newPost: Post): Promise<void> {
  const path = `posts/${newPost.id}`;
  try {
    const pDocRef = doc(db, "posts", newPost.id);
    await setDoc(pDocRef, cleanUndefined(newPost));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updatePostInFirestore(id: string, updatedData: Partial<Post>): Promise<void> {
  const path = `posts/${id}`;
  try {
    const pDocRef = doc(db, "posts", id);
    await updateDoc(pDocRef, cleanUndefined(updatedData));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePostFromFirestore(id: string): Promise<void> {
  const path = `posts/${id}`;
  try {
    const pDocRef = doc(db, "posts", id);
    await deleteDoc(pDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function incrementDownloadInFirestore(id: string): Promise<void> {
  const path = `posts/${id}`;
  try {
    const pDocRef = doc(db, "posts", id);
    await updateDoc(pDocRef, {
      downloads: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
