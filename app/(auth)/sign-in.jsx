import { View, Text, ScrollView,Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import{images} from '../../constants';
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from 'expo-router';
import { signIn } from '../../lib/appwrite';
import {useGlobalContext} from '../../context/GlobalProvider';
import { getCurrentUser } from '../../lib/appwrite';

const signin = () => {
  const[form,setForm]=useState({
    email:'',
    password:''
  })
const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const[isSubmitting, setIsSubmitting]=useState(false)
  const submit=async ()=>{
    if(form.email === "" || form.password === ""){
      Alert.alert('Error', 'Please fill in all the fields')
    }
    setIsSubmitting(true);

    try{
const result=await signIn(form.email, form.password)
router.replace("/Home")
    } catch(error){
      Alert.alert('Error', error.message)
    }finally{
      setIsSubmitting(false)
      getCurrentUser()
        .then((res) => {
                if(res){
                    setUser(res);
                }
        })
    }
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
      <View className="w-full min-h-[0vh] items-center justify-center px-4">
          <Image source={images.logo2}
            resizeMode='contain'
            className="w-[115]px' h-[35px]"          
          />
      </View>
        <View className="w-full  px-4 my-0">
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Login to Aurora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e)=> setForm({...form,email:e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e)=> setForm({...form,password:e})}
            otherStyles="mt-7"
            //keyboardType="email-address"
          />
          <CustomButton
          title="Sign In"
          handlePress={submit}
          ContainerStyles="mt-7"
          isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-psemibold text-gray-100">
              Don't have an account?

            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signin