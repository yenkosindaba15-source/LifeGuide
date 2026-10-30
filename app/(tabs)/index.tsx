import {
  ScrollView,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import BottomNavigation from "../../components/BottomNavigation";
import Header from "../../components/Header";
import PrayerCard from "../../components/PrayerCard";
import SearchBar from "../../components/SearchBar";
import VerseCard from "../../components/VerseCard";

export default function Home() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#e1d4c2",
      }}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      <Header />

      <SearchBar />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <VerseCard />

        <PrayerCard />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}