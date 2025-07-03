import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { fallbackMoviePoster, image185 } from '../api/moviesdb';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  [key: string]: any;
};

type Props = {
  title: string;
  hideSeeAll?: boolean;
  data: Movie[];
};

const MovieList: React.FC<Props> = ({ title, hideSeeAll = false, data }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => navigation.push('Movie', item)}>
            <View className="space-y-4 mr-4">
              <Image
                source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                className="rounded-3xl"
                style={{ width: width * 0.33, height: height * 0.22 }}
              />
              <Text className="text-neutral-300 ml-1">
                {item.title.length > 14 ? item.title.slice(0, 14) + '...' : item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default MovieList;