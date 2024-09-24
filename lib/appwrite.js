import { Alert } from "react-native";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.app.ctradisApp",
  projectId: "668bcc380013e2dce70d",
  databaseId: "668bd02c0021ffd28385",
  userCollectionId: "668bd5ee002781d7298f",
  videoCollectionId: "668bd61f0011cd61ad7e",
  likedVideosCollectionId: "669254b1000c83eee213",
  productsCollectionId: "6697974f002595188a1e",
  storageId: "668bda0b00381ccde53c",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
  likedVideosCollectionId,
  productsCollectionId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform); //application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log("createUser Function" + error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log("signIn Function" + error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || !currentUser.documents.length)
      throw new Error("No user documents found");

    return currentUser.documents[0];
  } catch (error) {
    console.log("getCurrentUser function " + error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId, [Query.orderDesc("$createdAt")]),
    ]);

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Get File Preview url
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export const insertLinkedVideos = async (video, userId) => {
  try {
    const newLinkedVideos = await databases.createDocument(
      databaseId,
      likedVideosCollectionId,
      ID.unique(),
      {
        userId: userId,
        videoUrl: video.video,
        videoId: video.$id,
        creator: video.creator.$id,
      }
    );

    if (!newLinkedVideos) throw new Error("Something went wrong");

    return newLinkedVideos;
  } catch (error) {
    console.log("insertLinkedVideos ", error);
  }
};

export const getLinkedUserPosts = async (userId) => {
  try {
    // console.log("Fetching liked videos for userId:", userId);

    // Fetch liked videos for the given user
    const likedVideos = await databases.listDocuments(
      databaseId,
      likedVideosCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    if (
      !likedVideos ||
      !likedVideos.documents ||
      likedVideos.documents.length === 0
    ) {
      return [];
    }

    // console.log("Liked Videos:", likedVideos.documents);

    // Prepare a list to hold the enriched posts
    const enrichedPosts = [];

    // Fetch additional details for each liked video
    for (const likedVideo of likedVideos.documents) {
      // console.log("Fetching video details for videoId:", likedVideo.videoId);

      // Fetch video details
      const videoDetails = await databases.getDocument(
        databaseId,
        videoCollectionId,
        likedVideo.videoId
      );

      // console.log("Video Details:", videoDetails);

      // Fetch creator details
      const creatorDetails = await databases.getDocument(
        databaseId,
        userCollectionId,
        likedVideo.creator
      );

      // console.log("Creator Details:", creatorDetails);

      // Combine liked video, video details, and creator details into a single object
      enrichedPosts.push({
        $id: likedVideo.$id,
        userId: likedVideo.userId,
        videoUrl: likedVideo.videoUrl,
        title: videoDetails.title,
        thumail: videoDetails.thumail,
        video: videoDetails.video,
        creator: {
          username: creatorDetails.username,
          avatar: creatorDetails.avatar,
        },
      });
    }

    // console.log("enrichedPosts: ", enrichedPosts);
    return enrichedPosts;
  } catch (error) {
    console.error("Error in getLinkedUserPosts:", error.message);
    throw new Error(error.message);
  }
};

export const getProducts = async () => {
  try {
    const products = await databases.listDocuments(
      databaseId,
      productsCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return products.documents;
  } catch (error) {
    console.log("getProducts: ", error);
  }
};

export const createProduct = async (form) => {
  try {
    if (typeof form.designation !== "string" || form.designation.length > 400) {
      Alert.alert("خطأ", "حقل المعلومات المهمة لا يقبل اكثر من 400 حرف");
    }

    const imageUrl = await uploadFile(form.image, "image");
    const product = await databases.createDocument(
      databaseId,
      productsCollectionId,
      ID.unique(),
      {
        productId: ID.unique(),
        title: form.title,
        entreprise: form.entreprise,
        product_image: imageUrl,
        designation: form.designation,
        details: form.details,
      }
    );

    return product;
  } catch (error) {
    console.log("Error createPost: ", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      productsCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await databases.listDocuments(
      databaseId,
      productsCollectionId,
      [Query.equal("productId", productId), Query.orderDesc("$createdAt")]
    );

    if (!product) throw new Error("Something went wrong");

    // console.log(product.documents);
    return product.documents;
  } catch (error) {
    throw new Error(error);
  }
};
