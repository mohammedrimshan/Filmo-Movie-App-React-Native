import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { styles, theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviesdb';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : ' mt-4';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  status: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  overview: string;
  [key: string]: any;
};

type CastMember = {
  id: number;
  character: string;
  original_name: string;
  profile_path: string | null;
  [key: string]: any;
};

type RouteParams = {
  item: Movie;
};

const MovieScreen: React.FC = () => {
  const { params: item } = useRoute<any>();
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie>({ id: 0, title: '', poster_path: '', status: '', release_date: '', runtime: 0, genres: [], overview: '' });
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMovieDetails = async (id: number) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id: number) => {
    const data = await fetchMovieCredits(id);
    if (data?.cast) setCast(data.cast);
    setLoading(false);
  };

  const getSimilarMovies = async (id: number) => {
    const data = await fetchSimilarMovies(id);
    if (data?.results) setSimilarMovies(data.results);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="flex-1 bg-neutral-900">
      <View className="w-full">
        <SafeAreaView className={'absolute z-20 w-full flex-row justify-between items-center px-4' + topMargin}>
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
          <View>
            <Image
              source={{ uri: image500(movie?.poster_path) || fallbackMoviePoster }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
              style={{ width, height: height * 0.40 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-wider">{movie?.title}</Text>
        {movie?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {movie?.status} • {movie?.release_date?.split('-')[0] || 'N/A'} • {movie?.runtime} min
          </Text>
        ) : null}
        <View className="flex-row justify-center mx-4 space-x-2">
          {movie?.genres?.map((genre, index) => (
            <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
              {genre?.name} {index + 1 !== movie.genres.length ? '•' : null}
            </Text>
          ))}
        </View>
        <Text className="text-neutral-400 mx-4 tracking-wide">{movie?.overview}</Text>
      </View>
      {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {similarMovies.length > 0 && <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />}
    </ScrollView>
  );
};

export default MovieScreen;