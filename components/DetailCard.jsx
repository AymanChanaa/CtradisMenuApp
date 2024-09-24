import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { ScrollView } from "react-native";
import { Image as CachedImage } from "react-native-expo-image-cache";

const DetailCard = ({ product }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView>
      <View className="flex-col items-center px-4 mb-14">
        <View className="">
          <Text className="text-white font-psemibold text-xl">
            تفاصيل حول المنتج
          </Text>
        </View>
        <TouchableOpacity
          className="w-full h-80 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setQuery(product.productId);
            if (pathname.startsWith("/details"))
              router.setParams({ productId: product.productId });
            else router.push(`/details/${product.productId}`);
          }}
        >
          {loading && (
            <ActivityIndicator
              size="large"
              color="#ffffff"
              style={{ position: "absolute" }}
            />
          )}
          <CachedImage
            uri={product.product_image}
            className="w-full h-full rounded-xl mt-3"
            onLoad={() => setLoading(false)}
          />
        </TouchableOpacity>
        <View className="flex-row gap-3 mt-5">
          <View className="flex-row flex-1">
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="text-white font-psemibold text-3xl"
                numberOfLines={1}
              >
                {product.title}
              </Text>
              <Text className="text-gray-100 font-pregular text-2xl">
                {product.designation}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row">
          <View className="flex-1 ml-3 gap-y-1 mt-6">
            <Text className="text-secondary-100 font-psemibold text-2xl text-right pr-3">
              المزيد من التفاصيل
            </Text>
            <Text className="text-gray-100 font-pregular pt-4 text-2xl text-right pr-2">
              {product.details}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailCard;
