import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import {
    db,
} from "./firebase";

export type ReadingHistoryItem = {
  id: string;
  book: string;
  chapter: number;
  reference: string;
  openedAt?: Date;
};

const createReadingHistoryId = (
  book: string,
  chapter: number,
  date: Date
): string => {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const cleanedBook =
    book
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(
        /[^a-z0-9-]/g,
        ""
      );

  return `${year}-${month}-${day}-${cleanedBook}-${chapter}`;
};

export const saveReadingHistory =
  async (
    userId: string,
    book: string,
    chapter: number
  ): Promise<void> => {
    const cleanedBook =
      book.trim();

    if (
      !userId ||
      !cleanedBook ||
      !chapter
    ) {
      return;
    }

    const historyId =
      createReadingHistoryId(
        cleanedBook,
        chapter,
        new Date()
      );

    await setDoc(
      doc(
        db,
        "users",
        userId,
        "readingHistory",
        historyId
      ),
      {
        book:
          cleanedBook,

        chapter,

        reference:
          `${cleanedBook} ${chapter}`,

        openedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  };

export const getReadingHistory =
  async (
    userId: string
  ): Promise<
    ReadingHistoryItem[]
  > => {
    const historyQuery =
      query(
        collection(
          db,
          "users",
          userId,
          "readingHistory"
        ),

        orderBy(
          "openedAt",
          "desc"
        )
      );

    const snapshot =
      await getDocs(
        historyQuery
      );

    return snapshot.docs.map(
      (historyDocument) => {
        const data =
          historyDocument.data();

        return {
          id:
            historyDocument.id,

          book:
            data.book || "",

          chapter:
            Number(
              data.chapter ?? 0
            ),

          reference:
            data.reference || "",

          openedAt:
            data.openedAt
              ?.toDate?.(),
        };
      }
    );
  };
