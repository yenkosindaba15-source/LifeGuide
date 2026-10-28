import {
    collection,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore";

import {
    auth,
    db,
} from "./firebase";

const deleteCollectionDocuments =
  async (
    collectionReference: any
  ): Promise<void> => {
    const snapshot =
      await getDocs(
        collectionReference
      );

    for (
      const documentSnapshot
      of snapshot.docs
    ) {
      await deleteDoc(
        documentSnapshot.ref
      );
    }
  };

const deleteHighlights = async (
  userId: string
): Promise<void> => {
  const highlightsReference =
    collection(
      db,
      "users",
      userId,
      "highlights"
    );

  await deleteCollectionDocuments(
    highlightsReference
  );
};

const deleteAIChats = async (
  userId: string
): Promise<void> => {
  const chatsReference =
    collection(
      db,
      "users",
      userId,
      "aiChats"
    );

  const chatsSnapshot =
    await getDocs(
      chatsReference
    );

  for (
    const chatDocument
    of chatsSnapshot.docs
  ) {
    const messagesReference =
      collection(
        db,
        "users",
        userId,
        "aiChats",
        chatDocument.id,
        "messages"
      );

    await deleteCollectionDocuments(
      messagesReference
    );

    await deleteDoc(
      chatDocument.ref
    );
  }
};

export const deleteCurrentUserData =
  async (): Promise<void> => {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user was found."
      );
    }

    const userId =
      user.uid;

    await deleteHighlights(
      userId
    );

    await deleteAIChats(
      userId
    );

    await deleteDoc(
      doc(
        db,
        "users",
        userId
      )
    );
  };