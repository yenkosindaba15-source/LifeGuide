import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";

export type ChatRole =
  | "user"
  | "assistant";

export type SavedChat = {
  id: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SavedChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt?: Date;
};

const createChatTitle = (
  firstQuestion: string
): string => {
  const cleanedTitle =
    firstQuestion
      .replace(/\s+/g, " ")
      .trim();

  if (cleanedTitle.length <= 45) {
    return cleanedTitle;
  }

  return `${cleanedTitle.slice(
    0,
    42
  )}...`;
};

export const createAIChat = async (
  userId: string,
  firstQuestion: string
): Promise<string> => {
  const chatReference =
    await addDoc(
      collection(
        db,
        "users",
        userId,
        "aiChats"
      ),
      {
        title:
          createChatTitle(
            firstQuestion
          ),

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

  return chatReference.id;
};

export const saveAIChatMessage =
  async (
    userId: string,
    chatId: string,
    role: ChatRole,
    text: string
  ): Promise<void> => {
    const cleanedText =
      text.trim();

    if (!cleanedText) {
      return;
    }

    await addDoc(
      collection(
        db,
        "users",
        userId,
        "aiChats",
        chatId,
        "messages"
      ),
      {
        role,
        text: cleanedText,
        createdAt:
          serverTimestamp(),
      }
    );

    await updateDoc(
      doc(
        db,
        "users",
        userId,
        "aiChats",
        chatId
      ),
      {
        updatedAt:
          serverTimestamp(),
      }
    );
  };

export const getAIChats = async (
  userId: string
): Promise<SavedChat[]> => {
  const chatsQuery = query(
    collection(
      db,
      "users",
      userId,
      "aiChats"
    ),
    orderBy("updatedAt", "desc")
  );

  const snapshot =
    await getDocs(chatsQuery);

  return snapshot.docs.map(
    (chatDocument) => {
      const data =
        chatDocument.data();

      return {
        id: chatDocument.id,

        title:
          data.title ||
          "Bible Conversation",

        createdAt:
          data.createdAt?.toDate?.(),

        updatedAt:
          data.updatedAt?.toDate?.(),
      };
    }
  );
};

export const getAIChatMessages =
  async (
    userId: string,
    chatId: string
  ): Promise<SavedChatMessage[]> => {
    const messagesQuery = query(
      collection(
        db,
        "users",
        userId,
        "aiChats",
        chatId,
        "messages"
      ),
      orderBy("createdAt", "asc")
    );

    const snapshot =
      await getDocs(messagesQuery);

    return snapshot.docs.map(
      (messageDocument) => {
        const data =
          messageDocument.data();

        return {
          id: messageDocument.id,

          role:
            data.role ===
            "assistant"
              ? "assistant"
              : "user",

          text:
            data.text || "",

          createdAt:
            data.createdAt?.toDate?.(),
        };
      }
    );
  };

export const deleteAIChat = async (
  userId: string,
  chatId: string
): Promise<void> => {
  const messagesSnapshot =
    await getDocs(
      collection(
        db,
        "users",
        userId,
        "aiChats",
        chatId,
        "messages"
      )
    );

  if (messagesSnapshot.empty) {
    await deleteDoc(
      doc(
        db,
        "users",
        userId,
        "aiChats",
        chatId
      )
    );

    return;
  }

  const batch =
    writeBatch(db);

  messagesSnapshot.docs.forEach(
    (messageDocument) => {
      batch.delete(
        messageDocument.ref
      );
    }
  );

  batch.delete(
    doc(
      db,
      "users",
      userId,
      "aiChats",
      chatId
    )
  );

  await batch.commit();
};