import { useState } from "react";
import BottomNav, { type Tab } from "@/components/BottomNav";
import FeedScreen from "@/components/FeedScreen";
import MapScreen from "@/components/MapScreen";
import MatchScreen from "@/components/MatchScreen";
import ExploreScreen from "@/components/ExploreScreen";
import MessagesScreen from "@/components/MessagesScreen";
import CultureLearnScreen from "@/components/CultureLearnScreen";
import NewsScreen from "@/components/NewsScreen";
import CampusScreen from "@/components/CampusScreen";
import AskForHelpScreen from "@/components/AskForHelpScreen";
import ProfileScreen from "@/components/ProfileScreen";
import { cities, type City } from "@/data/cityData";
import { useMessages } from "@/hooks/useMessages";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const { conversations } = useMessages();
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      {activeTab === "feed" && <FeedScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "map" && <MapScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "match" && <MatchScreen selectedCity={selectedCity} />}
      {activeTab === "explore" && <ExploreScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "messages" && <MessagesScreen />}
      {activeTab === "news" && <NewsScreen />}
      {activeTab === "culture" && <CultureLearnScreen />}
      {activeTab === "campus" && <CampusScreen />}
      {activeTab === "help" && <AskForHelpScreen onOpenDM={() => setActiveTab("messages")} />}
      {activeTab === "profile" && <ProfileScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} unreadMessages={unreadMessages} />
    </div>
  );
};

export default Index;
