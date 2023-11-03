import React, { Component } from 'react';
import { View, SafeAreaView, Platform, StatusBar, ViewProps } from 'react-native';



/**
 * Screen Wrapper to apply padding space on status bar
 */
export const Page = React.memo(({ children, ...props }: ViewProps) => {
  return <SafeAreaView {...props} style={[{ paddingTop: StatusBar.currentHeight }, props.style]}>
    {children}
  </SafeAreaView>
});