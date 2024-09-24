import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Video } from "expo-av";
import { icons } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode } from "react-native-video";
import { createProduct } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    entreprise: "",
    image: null,
    designation: "",
    details: "",
  });

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          image: result.assets[0],
        });
      }
    }
  };

  const submit = async () => {
    if (
      form.title === "" ||
      form.entreprise === "" ||
      form.designation === "" ||
      form.details === "" ||
      !form.image
    ) {
      return Alert.alert("يرجى تقديم كافة المعلومات");
    }

    setUploading(true);

    try {
      await createProduct(form);

      Alert.alert("نجاح", "تم تحميل المنتج بنجاح");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        entreprise: "",
        image: null,
        designation: "",
        details: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold text-center">
          إنشاء منتوج
        </Text>

        <FormField
          title="اسم المنتوج"
          value={form.title}
          placeholder="اكتب اسم المنتوج هنا..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="اسم الشركة"
          value={form.entreprise}
          placeholder="اكتب اسم الشركة هنا..."
          handleChangeText={(e) => setForm({ ...form, entreprise: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium text-right pr-3">
            تحميل صورة المنتوج
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  اختر صورة
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="معلومات مهمة"
          value={form.designation}
          placeholder=" اضف المعلومات المهمة عن المنتوج هنا باختصار ... "
          handleChangeText={(e) => setForm({ ...form, designation: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="معلومات اضافية"
          value={form.details}
          placeholder=" اضف المعلومات الاضافية عن المنتوج هنا..."
          handleChangeText={(e) => setForm({ ...form, details: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="اضافة المنتوج"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default create;
