import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title?: string;
};

export default function Header({ title }: HeaderProps) {

  const hour = new Date().getHours();

  let greeting = "Good Day!";

  if (hour < 12) {
    greeting = "Good Morning!";
  } else if (hour < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  const headerTitle = title ?? greeting;

  return (
    <View style={styles.container}>

      <Text style={styles.greeting}>
        {headerTitle}
      </Text>

      <TouchableOpacity style={styles.logoButton}>
        <Image
          source={require("../assets/images/YHWH-post-e1655321856590.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    marginBottom: 30,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: "#291c0e",
  },

  logoButton: {
    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: "#f8f4ef",

    borderWidth: 2,
    borderColor: "#beb5a9",

    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});