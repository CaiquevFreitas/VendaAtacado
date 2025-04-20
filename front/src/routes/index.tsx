import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainStackNavigator from './mainStack';

export default function Routes() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserType = async () => {
      const storedType = await AsyncStorage.getItem('userType');
      setUserType(storedType ?? 'cliente');
      setLoading(false);
    };
    checkUserType();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <MainStackNavigator userType={userType} />
    </NavigationContainer>
  );
}
