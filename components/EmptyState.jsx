import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title,subtitle}) => {
  return (
    <View className="justify-center items-center px-4 w-full">       
        <Image source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode='contain'
        />
         <Text className="font-pmedium text-sm text-gray-100">
            {subtitle}
        </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {title}
              </Text>
              <CustomButton
            title="Create Video"
            handlePress={() => router.push("/Create")}
            ContainerStyles="w-full my-5"
            /> 
    </View>
  )
}

export default EmptyState