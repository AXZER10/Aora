import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { StatusBar } from 'expo-status-bar';
import {getAllPosts} from '../../lib/appwrite'
import {getLatestPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {

  const {data:posts, refetch} = useAppwrite(getAllPosts)
  
  const {data:latestPosts} = useAppwrite(getLatestPosts)

  const[refreshing, setRefreshing] = useState(false)

  const {user, setUser, setIsLoggedIn} = useGlobalContext();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();    
    setRefreshing(false);
  }
  //console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full border-2 border-red">
      <FlatList
        data={[]}
        //data={posts}
        keyExtractor={(item) => item.$id} 
        renderItem={({ item }) => (
            <VideoCard
            video={item}
            />
        )}
        ListHeaderComponent={() => (
          <View className="px-4 space-y-6 pb-8">
            <View className="flex-column mb-6 justify-left">
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {user?.username}
              </Text>
            <View/>  
            <View className="mt-1.5 absolute right-0">
              <Image
                source={images.logoSmall}
                className="w-9 h-10 "
                resizeMode="contain"
              />
            </View>
            </View>
            <SearchInput
            />
            <View>
            <Text className="font-pmedium text-lg text-gray-100 mt-2 w-full pb-1">
              Trending Videos
            </Text>
            </View>
            <Trending
              posts={latestPosts }
            />
          </View>
            
        )}
        ListEmptyComponent={() => (
          <View className="w-full items-center justify-center flex-grow">
            <EmptyState
              title="No Videos Found"
              subtitle="Be the first to upload"
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
      <StatusBar backgroundColor="#1611622" style="light"/>
    </SafeAreaView>
    
  );
};

export default Home;
