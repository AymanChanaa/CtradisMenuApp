import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";
import { getProductById } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import DetailCard from "../../components/DetailCard";
import { images } from "../../constants";

const productDetails = () => {
  const { productId } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => getProductById(productId));
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    refetch();
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setisLoading(true);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (posts && posts.length > 0) {
      setisLoading(false);
    }
  }, [posts]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        //data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        // data={[]}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <DetailCard product={item} />}
        ListHeaderComponent={() => (
          <View className="justify-between items-start flex-row m-6">
            <Image
              source={images.logo}
              className="w-12 h-10 justify-center"
              resizeMode="contain"
            />
            <Text className="font-pbold text text-xl text-gray-100 text-right">
              نتائج البحث
            </Text>
          </View>
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <EmptyState
              title="لم يتم العثور على منتجات"
              subtitle="لم يتم العثور على منتجات لاستعلام البحث هذا"
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default productDetails;
