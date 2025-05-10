import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TextInput, Button, Text } from 'react-native-paper';
import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@/hooks/useAppTheme';

interface CustomDateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date?: Date) => void;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  date,
  onDateChange,
  label = "Select Date/Time",
  mode = "datetime",
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { colors } = useAppTheme();

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate?: Date) => {
    hidePicker();
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const displayFormat = mode === 'date' ? 'PPP' : (mode === 'time' ? 'p' : 'PPP p');
  const displayValue = date ? format(date, displayFormat) : `Select ${mode}`;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TouchableOpacity onPress={showPicker} style={[styles.inputContainer, { borderColor: colors.border }]}>
        <Text style={{ color: date ? colors.text : colors.mutedText }}>{displayValue}</Text>
        <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        date={date || new Date()} // Default to now if no date is set
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        is24Hour // Optional: use 24-hour format
        // minimumDate={new Date()} // Optional: prevent past dates
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 12, // Following Paper's TextInput label style
    // fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14, // Adjust to match Paper's TextInput height
    minHeight: 50, // Ensure it has some height
  },
});

export default CustomDateTimePicker;
