import { View, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const Loading: React.FC = () => {
  return (
    <View style={{ height, width }} className="absolute flex-row justify-center items-center">
      <Progress.CircleSnail thickness={12} size={160} color={theme.background} />
    </View>
  );
};

export default Loading;