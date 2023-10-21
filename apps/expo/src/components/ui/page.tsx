import React, { Component } from 'react';
import { View, SafeAreaView, Platform, StatusBar, ViewProps } from 'react-native';



/**
 * Screen Wrapper to apply padding space on status bar
 */
export const Page = React.memo(({ children, ...props }: ViewProps) => {
  if (Platform.OS === 'ios') return (
    <SafeAreaView {...props}>
      {children}
    </SafeAreaView>
  );


  return (
    <View {...props} style={[{ paddingTop: StatusBar.currentHeight }, props.style]}>
      {children}
    </View>
  );
});