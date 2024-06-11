import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from '@/components/FormField';
import { Video, ResizeMode } from 'expo-av';
import { icons } from '../../constants';
import CustomButton from '../../components/CustomButton';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { createVideo } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
    const [upLoading, setUploading] = useState(false);
    const { user } = useGlobalContext();
    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
    });

    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: selectType === 'image'
                ? ['image/png', 'image/jpg']
                : ['video/mp4', 'video/gif']
        });

        if (!result.canceled) {
            if (selectType === 'image') {
                setForm({ ...form, thumbnail: result.assets[0] });
            }
            if (selectType === 'video') {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    }

    const submit = async () => {
        if (form.prompt === '' || form.title === '' || !form.thumbnail || !form.video) {
            return Alert.alert("Please fill all fields");
        }
        setUploading(true);

        try {
            await createVideo({ ...form, userId: user.$id });
            Alert.alert('Success', "Uploaded successfully");
            router.push('/Home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
                prompt: ''
            });
            setUploading(false);
        }
    }

    return (
        <SafeAreaView className='bg-primary'>
            <ScrollView className="px-4 my-6 h-full">
                <Text className='text-2xl text-white font-psemibold'>
                    Upload Video
                </Text>
                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catchy title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />
                <View className="mt-5 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => openPicker("video")}
                    >
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                            />
                        ) : (
                            <View className="w-full h-40 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image source={icons.upload}
                                        className="h-1/2 w-1/2"
                                        resizeMode='contain' />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View className='mt-5 space-y-2'>
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>
                    <TouchableOpacity activeOpacity={0.6}
                        onPress={() => openPicker("image")}
                    >
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode='cover'
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-16 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                <Image source={icons.upload}
                                    className="h-5 w-5"
                                    resizeMode='contain' />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file to upload
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <FormField
                    title="Prompt"
                    value={form.prompt}
                    placeholder="Give your video a catchy title..."
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-5"
                />
                <View className="mt-5 w-full">
                    <CustomButton
                        title="Submit and Publish"
                        handlePress={submit}
                        isLoading={upLoading}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Create;
