import { useState } from "react";
import { useSessionDuration } from "@/hooks/useAnalytics";
import BottomNav, { type Tab } from "@/components/BottomNav";
import HomeScreen from "@/components/HomeScreen";
import DiscoverScreen from "@/components/DiscoverScreen";
import EventsScreen from "@/components/EventsScreen";
import MessagesScreen from "@/components/MessagesScreen";
import ProfileScreen from "@/components/ProfileScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import { cities, type City } from "@/data/cityData";
import { useMessages } from "@/hooks/useMessages";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  useSessionDuration();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const { conversations } = useMessages();
  const { profile, loading: profileLoading } = useProfile();
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  // Show onboarding if profile exists but hasn't completed it
  const showOnboarding = !profileLoading && profile && !profile.onboarding_completed;

  if (showOnboarding) {
    return (
      <div className="max-w-lg mx-auto min-h-screen bg-background">
        <OnboardingFlow onComplete={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      {activeTab === "home" && <HomeScreen onNavigate={(tab) => setActiveTab(tab as Tab)} />}
      {activeTab === "discover" && <DiscoverScreen selectedCity={selectedCity} onCityChange={setSelectedCity} onOpenDM={() => setActiveTab("messages")} />}
      {activeTab === "events" && <EventsScreen selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      {activeTab === "messages" && <MessagesScreen />}
      {activeTab === "profile" && <ProfileScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} unreadMessages={unreadMessages} />
    </div>
  );
};

export default Index;
