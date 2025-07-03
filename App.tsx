import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppNavigation from './AppNavigation';
import "./global.css"
const App: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AppNavigation />
    </View>
  );
};

export default App;