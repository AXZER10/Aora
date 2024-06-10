/*import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  

    return (
        <SafeAreaView className="bg-primary h-full">
            <View>
            <Text className="text-3xl text-white">{query}</Text>
            </View>
        </SafeAreaView>
    
  )
}
export default Search
*/

import { useLocalSearchParams } from 'expo-router'
import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { StatusBar } from 'expo-status-bar';
import {searchPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';

const Search = () => {

    const { query } = useLocalSearchParams();

    const { data: posts, refetch } = useAppwrite(() => searchPosts(query));


  useEffect(()=> {
    refetch()
  },[query])
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
          <View className="px-4">
              <Text className="font-pmedium text-sm text-gray-100">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query}
                /> 
              </View>
            </View>
        )}
        ListEmptyComponent={() => (
          <View className="w-full items-center justify-center flex-grow">
            <EmptyState
              title="No Videos Found"
              subtitle="No videos found for this search query"
            />
          </View>
        )}
      />
      <StatusBar backgroundColor="#1611622" style="light"/>
    </SafeAreaView>
    
  );
};

export default Search;
