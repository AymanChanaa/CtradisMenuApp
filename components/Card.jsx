import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { Image as CachedImage } from "react-native-expo-image-cache";

const Card = ({ product }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <View className="flex-col items-center px-4 mb-14">
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
      <View className="flex-row gap-3 items-start mt-5">
        <View className="flex-row items-center justify-center flex-1">
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {product.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {product.designation}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Card;
