import { useState } from "react";
import { useSessionDuration } from "@/hooks/useAnalytics";
import BottomNav, { type Tab } from "@/components/BottomNav";
import FeedScreen from "@/components/FeedScreen";
import MapScreen from "@/components/MapScreen";
import ExploreScreen from "@/components/ExploreScreen";
import MessagesScreen from "@/components/MessagesScreen";
import CampusScreen from "@/components/CampusScreen";
import ProfileScreen from "@/components/ProfileScreen";
import { cities, type City } from "@/data/cityData";
import { useMessages } from "@/hooks/useMessages";

const Index = () => {
  useSessionDuration();
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const { conversations } = useMessages();
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      {activeTab === "feed" && <FeedScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "map" && <MapScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "explore" && <ExploreScreen selectedCity={selectedCity} onCityChange={setSelectedCity} onOpenDM={() => setActiveTab("messages")} />}
      {activeTab === "messages" && <MessagesScreen />}
      {activeTab === "campus" && <CampusScreen />}
      {activeTab === "profile" && <ProfileScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} unreadMessages={unreadMessages} />
    </div>
  );
};

export default Index;
