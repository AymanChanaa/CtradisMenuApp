import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { StatusBar } from "expo-status-bar";
import { getAllPosts, getLatestPosts, getProducts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import Card from "../../components/Card";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const [refreshing, setrefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const { data: posts, refetch: refetchAllPosts } = useAppwrite(getProducts);

  const onRefresh = async () => {
    setrefreshing(true);
    // re call videos if any new videos appears
    await refetchAllPosts();
    setrefreshing(false);
  };

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
        renderItem={({ item }) => <Card product={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-5 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-center text-xl text-gray-100">
                  مرحبا بك
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  دليل Ctradis
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-12 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput placeholder="ابحث عن المنتوج هنا" />

            <View classeName="w-full flex-1 pt-5 pb-8 mb-8">
              <Text className="text-gray-100 text-2xl font-pregular mb-3 text-right">
                المنتوجات{" "}
              </Text>
            </View>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
