import React, { ReactNode, useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: object;
  flat?: boolean; // true = 1px bevel, thin toolbar-style button
  active?: boolean; // permanently pressed-looking (e.g. selected tab)
};

// Beveled push-button: raised by default, pressed bevel + solid fill while
// held, matching the prototype's style-hover/style-active inline pairs.
export function Win98Button({ children, onPress, style, textStyle, flat, active }: Props) {
  const [pressed, setPressed] = useState(false);
  const showPressed = active || pressed;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        bevelStyle(showPressed ? bevel.pressedOuter : bevel.raisedOuter, flat ? 1 : 2),
        { backgroundColor: showPressed ? win98.facePressed : win98.face },
        style,
      ]}
    >
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text style={[styles.text, textStyle]} numberOfLines={1}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 11,
  },
  text: {
    fontFamily: fontBody,
    fontWeight: '700',
    fontSize: 13,
    color: win98.windowText,
  },
});
