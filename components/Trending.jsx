import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons, images } from "../constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  const videoRef = useRef(null);

  return (
    <View className="flex-row items-center px-4 mb-60">
      <Animatable.View
        className="mr-5"
        animation={activeItem === item.$id ? zoomIn : zoomOut}
        duration={500}
      >
        {play ? (
          <Video
            ref={videoRef}
            source={{
              uri: item.video,
            }}
            className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
            onError={(error) => console.log("Video Error:", error)}
          />
        ) : (
          <View className="mr-3">
            <TouchableOpacity
              className="justify-center items-center"
              activeOpacity={0.7}
              onPress={() => {
                setPlay(true);
              }}
            >
              <ImageBackground
                source={{ uri: item.thumail }}
                className="w-60 h-full rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40 mb-30"
              />

              <Image
                source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </Animatable.View>
    </View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveItem(viewableItems[0].key);
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
