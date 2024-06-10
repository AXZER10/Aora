import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { StatusBar } from 'expo-status-bar';
import {userPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite';
import {signOut} from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard';
import {useGlobalContext} from '../../context/GlobalProvider'
import {icons} from '../../constants'
import { router } from 'expo-router';
import InfoBox from '../../components/infoBox'

const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();

    const { data: posts} = useAppwrite(() => userPosts(user.$id));

    const logout = async () => {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
  
      router.replace("/sign-in");
    };

  //console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full border-2 border-red">
      <FlatList
        //data={[]}
        data={posts}
        keyExtractor={(item) => item.$id} 
        renderItem={({ item }) => (
            <VideoCard
            video={item}
            />
        )}
        ListHeaderComponent={() => (
          <View>
            <View className='w-full justify-center        items-center px-4'>
            <TouchableOpacity className="w-full items-end"
            onPress={logout}
            >
              <Image source={icons.logout}
              resizeMode='contain'
              className="w-6 h-6"/>
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-[11px] justify-center items-center">
              <Image source={{uri:user?.avatar}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode='cover'
              />
            </View>
            <InfoBox
            title={user?.username}
            containerStyles="mt-5"
            titleStyles="text-lg"
            />
          </View>
          <View className="flex flex-row items-center justify-center">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="w-full items-center justify-center flex-grow">
            <EmptyState
              title="Upload your First Video"
              subtitle="No videos uploaded"
            />
          </View>
        )}
      />
      <StatusBar backgroundColor="#1611622" style="light"/>
    </SafeAreaView>
    
  );
};

export default Profile;
