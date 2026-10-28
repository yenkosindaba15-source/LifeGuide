import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

export const signup = async (
  email: string,
  password: string
) => {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const login = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const logout = async () => {
  return await signOut(auth);
};

export const reauthenticateUser =
  async (
    password: string
  ): Promise<void> => {
    const user =
      auth.currentUser;

    if (!user || !user.email) {
      throw new Error(
        "No authenticated user was found."
      );
    }

    const credential =
      EmailAuthProvider.credential(
        user.email,
        password
      );

    await reauthenticateWithCredential(
      user,
      credential
    );
  };

export const deleteCurrentAuthUser =
  async (): Promise<void> => {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user was found."
      );
    }

    await deleteUser(user);
  };