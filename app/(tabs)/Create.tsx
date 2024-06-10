import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";

const Create = () => {
  return (
    //<SafeAreaView>
      <View>
        <Text>Create</Text>
        <Text>Create</Text>
        <Text>Create</Text>
        <Text>Create</Text>
      <Text className="absolute top-4 left-4 bg-red-500 p-2 text-white">Top Left</Text>
      <Text className="absolute top-4 right-4 bg-blue-500 p-2 text-white">Top Right</Text>
      <Text className="absolute bottom-4 left-4 bg-green-500 p-2 text-white">Bottom Left</Text>
      <Text className="absolute bottom-4 right-4 bg-yellow-500 p-2 text-white">Bottom Right</Text>
    </View>
    //</SafeAreaView>
    
  )
}

export default Create