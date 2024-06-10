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
