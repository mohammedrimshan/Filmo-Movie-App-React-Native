import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { image500 } from "../api/moviesdb";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the type for AnimatedFlatList to accept FlatList props with Movie type
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ComponentType<
  React.ComponentProps<typeof FlatList<Movie>>
>;

const { width, height } = Dimensions.get("window");

type Movie = {
  id: number;
  poster_path: string;
  [key: string]: any;
};

type Props = {
  data: Movie[];
};

const CARD_WIDTH = width * 0.7;
const SPACING = 20;
const ITEM_WIDTH = CARD_WIDTH + SPACING;

const MovieCard: React.FC<{
  item: Movie;
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({ item, index, scrollX }) => {
  const uri = image500(item.poster_path);

  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollX.value / ITEM_WIDTH;
    const diff = position - index;

    const scale = interpolate(diff, [-1, 0, 1], [0.8, 1, 0.8], "clamp");
    const opacity = interpolate(diff, [-1, 0, 1], [0.5, 1, 0.5], "clamp");

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Movie", item)}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image
          source={uri ? { uri } : require("../assets/adaptive-icon.png")}
          style={styles.poster}
          resizeMode="cover"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const TrendingMovies: React.FC<Props> = ({ data }) => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trending</Text>
        <Text style={styles.noData}>No trending movies available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending</Text>
      <AnimatedFlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (width - CARD_WIDTH) / 2,
        }}
        renderItem={({
          item,
          index,
        }: {
          item: Movie;
          index: number;
        }) => <MovieCard item={item} index={index} scrollX={scrollX} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  noData: {
    color: "white",
    textAlign: "center",
  },
  card: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    borderRadius: 24,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: height * 0.38,
  },
});

export default TrendingMovies;