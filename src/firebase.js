import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config web Firebase memang publik; yang menjaga data adalah Firestore
// Security Rules (setiap akun hanya boleh membaca/menulis users/{uid}).
const firebaseConfig = {
  apiKey: 'AIzaSyDDGLf1BJPHxhsdyDFhYkKwMBToWQoIh7o',
  authDomain: 'rafi-s-planner.firebaseapp.com',
  projectId: 'rafi-s-planner',
  storageBucket: 'rafi-s-planner.firebasestorage.app',
  messagingSenderId: '475380595595',
  appId: '1:475380595595:web:f84b41f3140fda71014d8e',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
