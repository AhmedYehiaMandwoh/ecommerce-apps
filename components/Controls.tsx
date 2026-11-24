import React from 'react';
import {Pressable,Text,View,TextInput,StyleSheet} from 'react-native';
const st=StyleSheet.create({btn:{backgroundColor:'#ff6c08',padding:15,borderRadius:11,alignItems:'center',marginTop:9},alt:{backgroundColor:'#edf4ff'},btnText:{color:'white',fontWeight:'800'},label:{textAlign:'right',fontWeight:'700',color:'#344762',marginBottom:7},input:{borderWidth:1,borderColor:'#dce4ef',borderRadius:11,padding:12,textAlign:'right',backgroundColor:'white',color:'#14294b'}});
export const Btn = ({
  title,
  onPress,
  alt = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  alt?: boolean;
  disabled?: boolean;
}) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={[st.btn, alt && st.alt, disabled && { opacity: 0.5 }]}
  >
    <Text style={[st.btnText, alt && { color: "#0757e9" }]}>{title}</Text>
  </Pressable>
);
export const Field = ({
  label,
  value,
  onChange,
  secure = false,
  numeric = false,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  secure?: boolean;
  numeric?: boolean;
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={st.label}>{label}</Text>
    <TextInput
      style={st.input}
      value={value}
      onChangeText={onChange}
      secureTextEntry={secure}
      keyboardType={numeric ? "numeric" : "default"}
      autoCapitalize="none"
      accessibilityLabel={label}
    />
  </View>
);

