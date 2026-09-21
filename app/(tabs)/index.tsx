import { SafeAreaView, ScrollView } from "react-native";

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
    >
      <Header />

      <SearchBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <VerseCard />
        <PrayerCard />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}