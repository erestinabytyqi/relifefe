import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Register a new user with a given role (admin, nurse, doctor)
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<import('firebase/auth').User>}
 */
export const registerUser = async (email, password, role = 'user') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save additional user info with role
  await setDoc(doc(db, 'users', user.uid), {
    email,
    role,
    createdAt: new Date(),
  });

  return user;
};

/**
 * Log in existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
