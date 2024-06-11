import { Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage, } from 'react-native-appwrite';

export const appwriteconfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aora',
    projectId: '666170cc002ce480bb14',
    databaseId: '666175fb00002c03b0fd',
    UserCollectionId: '66617630002ecb37d8d9',
    VideoCollectionId: '6661766a0017056778f4',
    storageId: '666177d5002381110f5d'
};

const client = new Client();

client
    .setEndpoint(appwriteconfig.endpoint)
    .setProject(appwriteconfig.projectId)
    .setPlatform(appwriteconfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password,username ) => {
    try {

        // Create a new user account
        const newAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            username
        );
        if (!newAccount) throw Error('User creation failed');

        // Get avatar URL
        const avatarUrl = avatars.getInitials(username);

        // Sign in the user
        await signIn(email, password);

        // Create a new user document in the database
        const newUser = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.UserCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        );
        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'An error occurred during user creation');
    };
};

// Function to sign in the user
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error.message || 'An error occurred during sign in');
    }
}
export const getCurrentUser = async () => {
    const currentAccount = await account.get();

    if(!currentAccount) throw Error;

    const currentUser=await databases.listDocuments(
        appwriteconfig.databaseId,
        appwriteconfig.UserCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
    )
    if(!currentUser) throw Error;

    return currentUser.documents[0];
}

export const getAllPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.VideoCollectionId
        );
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}
export const getLatestPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.VideoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}
export const searchPosts = async (query) => {
    try{
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.VideoCollectionId,
            [Query.search('Title', query)]
        );
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}

export const userPosts = async (userId) => {
    try{
        const posts = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.VideoCollectionId,
            [Query.equal('users',userId)]
        );
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}

export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

export const getFilePreview = async(fileId,type) => {
    let fileUrl;
    try {
        if(type==='video'){
            fileUrl=storage.getFileView(appwriteconfig.storageId,fileId)
        }
        else if(type==='image'){
            fileUrl=storage.getFilePreview(appwriteconfig.storageId,fileId,2000,2000,'top',100);
        }
        else{
            throw new Error("Invalid File Type")
        }
        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteconfig.storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error.message || 'Error uploading file');
    }
};


export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ]);

        if (!thumbnailUrl || !videoUrl) {
            throw new Error('Failed to upload files');
        }

        const newPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.VideoCollectionId,
            ID.unique(),
            {
                Title: form.title,
                Video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                users: form.userId
            }
        );
        return newPost;
    } catch (error) {
        throw new Error(error.message || 'Error creating video');
    }
};
