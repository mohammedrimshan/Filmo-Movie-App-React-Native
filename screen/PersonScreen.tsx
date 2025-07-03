import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { styles, theme } from '../theme';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from '../api/moviesdb';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');
// const ios = Platform.OS === 'ios';
const topMargin = ' my-3';

type Person = {
  id: number;
  name: string;
  place_of_birth: string;
  gender: number;
  birthday: string;
  known_for_department: string;
  popularity: number;
  biography: string;
  profile_path: string | null;
  [key: string]: any;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  [key: string]: any;
};

type RouteParams = {
  item: Person;
};

const PersonScreen: React.FC = () => {
  const { params: item } = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [personMovies, setPersonMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id: number) => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoading(false);
  };

  const getPersonMovies = async (id: number) => {
    const data = await fetchPersonMovies(id);
    if (data?.cast) setPersonMovies(data.cast);
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-neutral-900" contentContainerStyle={{ paddingBottom: 20 }}>
      <SafeAreaView className={'flex-row justify-between items-center mx-4 z-10 ' + topMargin}>
        <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
          <HeartIcon size={35} color={isFavourite ? theme.background : 'white'} />
        </TouchableOpacity>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        person && (
          <View>
            <View
              className="flex-row justify-center"
              style={{ shadowColor: 'gray', shadowRadius: 40, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1 }}
            >
              <View className="items-center rounded-full overflow-hidden h-72 w-72 border-neutral-500 border-2">
                <Image
                  source={{ uri: image342(person?.profile_path) || fallbackPersonImage }}
                  style={{ height: height * 0.43, width: width * 0.74 }}
                />
              </View>
            </View>
            <View className="mt-6">
              <Text className="text-3xl text-white font-bold text-center">{person?.name}</Text>
              <Text className="text-neutral-500 text-base text-center">{person?.place_of_birth}</Text>
            </View>
            <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Gender</Text>
                <Text className="text-neutral-300 text-sm">{person?.gender === 1 ? 'Female' : 'Male'}</Text>
              </View>
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Birthday</Text>
                <Text className="text-neutral-300 text-sm">{person?.birthday}</Text>
              </View>
              <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                <Text className="text-white font-semibold">Known for</Text>
                <Text className="text-neutral-300 text-sm">{person?.known_for_department}</Text>
              </View>
              <View className="px-2 items-center">
                <Text className="text-white font-semibold">Popularity</Text>
                <Text className="text-neutral-300 text-sm">{person?.popularity?.toFixed(2)} %</Text>
              </View>
            </View>
            <View className="my-6 mx-4 space-y-2">
              <Text className="text-white text-lg">Biography</Text>
              <Text className="text-neutral-400 tracking-wide">{person?.biography || 'N/A'}</Text>
            </View>
            <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
          </View>
        )
      )}
    </ScrollView>
  );
};

export default PersonScreen;