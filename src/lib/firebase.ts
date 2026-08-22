import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Role } from './types';

// Configuración Oficial de Firebase proporcionada para MuniTrack
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBP0QFlehroETYkAHOm787mlS4r_-6RMiY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "munitrack-67cd0.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "munitrack-67cd0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "munitrack-67cd0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "758549789937",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:758549789937:web:e66b3b028278308773fd50",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-09LY262K01"
};

// Inicialización Singleton de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export interface UserProfileData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  taxId?: string;
  role: Role;
  municipalityId: string;
  createdAt: string;
}

/**
 * Registra un usuario nuevo en Firebase Auth y guarda su perfil con Rol en Firestore
 */
export async function registerUserWithRole(
  name: string,
  email: string,
  pass: string,
  phone: string,
  role: Role,
  municipalityId: string,
  taxId?: string
): Promise<UserProfileData> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const uid = userCredential.user.uid;

  const profileData: UserProfileData = {
    uid,
    name,
    email,
    phone,
    taxId: taxId || 'XXX-XX-4910',
    role,
    municipalityId,
    createdAt: new Date().toISOString()
  };

  // Guardar datos del rol y municipio en Firestore
  try {
    await setDoc(doc(db, 'users', uid), profileData);
  } catch (e) {
    console.warn('[Firebase Firestore] No se pudo guardar doc pero Auth creó la cuenta:', e);
  }

  return profileData;
}

/**
 * Inicia sesión con Email y Contraseña y recupera el perfil del usuario de Firestore
 */
export async function loginUser(email: string, pass: string): Promise<UserProfileData | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const uid = userCredential.user.uid;

  // Intentar cargar perfil desde Firestore
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
  } catch (e) {
    console.warn('[Firebase Firestore] No se pudo obtener perfil Firestore, usando datos por defecto:', e);
  }

  // Fallback si no existe en Firestore aún
  return {
    uid,
    name: userCredential.user.displayName || email.split('@')[0],
    email: userCredential.user.email || email,
    phone: '(787) 555-0100',
    role: 'CITIZEN',
    municipalityId: 'muni-sanjuan',
    createdAt: new Date().toISOString()
  };
}

/**
 * Cerrar sesión en Firebase
 */
export async function logoutUser() {
  await firebaseSignOut(auth);
}
