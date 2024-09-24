import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchProducts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import Card from "../../components/Card";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchProducts(query));
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    refetch();
  }, [query]);

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
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              نتائج البحث
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
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
      />
    </SafeAreaView>
  );
};

export default Search;
