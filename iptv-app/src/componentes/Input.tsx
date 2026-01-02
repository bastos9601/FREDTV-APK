import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../utils/constantes';

interface InputProps extends TextInputProps {
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({ placeholder, ...props }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 15,
    paddingLeft: 45,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
