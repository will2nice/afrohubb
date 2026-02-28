import { useState } from "react";
import BottomNav, { type Tab } from "@/components/BottomNav";
import FeedScreen from "@/components/FeedScreen";
import ReelsScreen from "@/components/ReelsScreen";
import MapScreen from "@/components/MapScreen";
import MatchScreen from "@/components/MatchScreen";
import EventsScreen from "@/components/EventsScreen";
import MessagesScreen from "@/components/MessagesScreen";
import ProfileScreen from "@/components/ProfileScreen";
import { cities, type City } from "@/data/cityData";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      {activeTab === "feed" && <FeedScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "reels" && <ReelsScreen />}
      {activeTab === "map" && <MapScreen selectedCity={selectedCity} />}
      {activeTab === "match" && <MatchScreen />}
      {activeTab === "events" && <EventsScreen selectedCity={selectedCity} />}
      {activeTab === "messages" && <MessagesScreen />}
      {activeTab === "profile" && <ProfileScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
