import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";

function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex items-center min-h-[85vh] px-4 pt-8">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px] mb-2"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-psemibold text-center">
              دليل Ctradis
            </Text>
            <Text className="text-3xl text-white font-psemibold text-center">
              كل ما تحتاج لمعرفته عن{"\n"}
              <Text className="text-secondary-200">Ctradis</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[120px] h-[15px] absolute"
              style={{
                left: "50%",
                bottom: -15,
                transform: [{ translateX: -100 }],
              }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            مرحبا بكم في الدليل الشامل لشركة
            <Text className="text-sm font-pextrabold text-orange-700 text-center">
              {"\n"}Ctradis
            </Text>
          </Text>

          <CustomButton
            title="تقدم"
            handlePress={() => router.push("/home")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

export default App;
