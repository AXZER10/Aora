import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from '../constants'
import { Image } from "react-native"
import React from "react";
import CustomButton from "../components/CustomButton";
import { Redirect,router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function App(){
    
    const{isLoading,isLoggedIn}:any = useGlobalContext();
    
    if(!isLoading && isLoggedIn){
        return <Redirect href="/Home"/>
    }

    return(
        <SafeAreaView className="bg-primary h-full">
           <ScrollView contentContainerStyle={{height:'100%'}}>
            <View className="w-full justify-center items-center min-h-[80vh] px-4">
            <Image 
                source={images.logo}
                className="w-[130px] h-[84px]"
                resizeMode="contain"
                /> 
            <Image 
                source={images.cards}
                className="max-w-[380px] w-full h-[300px]"
                resizeMode="contain"
                /> 
                <View className="relative mt-10">
                    <Text className="text-3xl text-white font-bold text-center">
                        Discover endless possibilities with{' '}
                        <Text className="text-secondary-200">
                            Aora!
                        </Text>
                    </Text>
                    <Image 
                    source={images.path}
                    className="w-[136px] h-[15px]  absolute-bottom-0 -right-[245px]"
                    resizeMode="contain"
                    />
                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                        Where creativity meets innovation: embark on a journey of limitless exploration with Aora
                    </Text>
                    <View>
                
                </View>    
                </View>    
                
                <View className="w-full justify-center items-center">
                    <CustomButton
                    title="Continue with Email"
                    handlePress={()=>router.push('/sign-in')}
                    ContainerStyles="w-full mt-7"
                    />
                </View>
            </View>
           </ScrollView>
           <StatusBar backgroundColor="#1611622" style="light"/>
        </SafeAreaView>
        
    );
}