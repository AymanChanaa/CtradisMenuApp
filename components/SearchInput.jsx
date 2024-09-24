import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery, placeholder }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="border-black-200 border-2 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="flex-1 text-white font-pregular text-base"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            return Alert.alert(
              "عنوان مفقود",
              "الرجاء إدخال شيء ما لنتائج البحث عبر قاعدة البيانات"
            );
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMethod="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
