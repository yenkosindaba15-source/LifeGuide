import axios from "axios";

export const getChapter = async (
  book: string,
  chapter: string
) => {
  try {
    const response = await axios.get(
      `https://bible-api.com/${encodeURIComponent(
        `${book} ${chapter}`
      )}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};