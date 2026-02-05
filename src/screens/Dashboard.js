import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  StatusBar 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  // Trajets récents
  const recentTrips = [
    {
      id: 1,
      image: { uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' },
      destination: "Bakeli School of Technology",
      address: "Liberté 6, Dakar",
      distance: "12.5 km",
      duration: "25 min",
      type: "work"
    },
    {
      id: 2,
      image: { uri: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800' },
      destination: "Plateau - Centre ville",
      address: "Avenue Pompidou, Dakar",
      distance: "8.3 km",
      duration: "18 min",
      type: "business"
    },
    {
      id: 3,
      image: { uri: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800' },
      destination: "Université Cheikh Anta Diop",
      address: "Fann, Dakar",
      distance: "15.2 km",
      duration: "30 min",
      type: "school"
    },
    {
      id: 4,
      image: { uri: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800' },
      destination: "Les Almadies",
      address: "Pointe des Almadies, Dakar",
      distance: "18.7 km",
      duration: "35 min",
      type: "home"
    },
  ];

  const handleTripPress = (trip) => {
    alert(`Navigation vers:\n${trip.destination}\n${trip.address}\n\nDistance: ${trip.distance}\nTemps estimé: ${trip.duration}`);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'search') {
      alert('Rechercher une destination...');
    } else if (tab === 'add') {
      alert('Ajouter un nouveau trajet favori...');
    } else if (tab === 'folder') {
      alert('Mes trajets sauvegardés...');
    } else if (tab === 'profile') {
      alert('Mon profil et paramètres...');
    }
  };

  const handleNotifications = () => {
    alert('Notifications:\n- Trafic dense sur la VDN\n- Nouveau raccourci disponible\n- Rappel: Rendez-vous à 15h');
  };

  const handleMenu = () => {
    alert('Menu:\n- Mes destinations\n- Historique\n- Paramètres\n- Aide');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenu} style={styles.headerButton}>
          <Ionicons name="menu" size={28} color="#1e3a8a" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>TEKTAL</Text>
        
        <TouchableOpacity onPress={handleNotifications} style={styles.headerButton}>
          <View>
            <Ionicons name="notifications-outline" size={26} color="#1e3a8a" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Liste des trajets */}
        <View style={styles.tripsContainer}>
          {recentTrips.map((trip, index) => (
            <TouchableOpacity 
              key={trip.id} 
              style={[
                styles.tripCard,
                { marginBottom: index === recentTrips.length - 1 ? 0 : 20 }
              ]}
              onPress={() => handleTripPress(trip)}
              activeOpacity={0.9}
            >
              {/* Image de la destination */}
              <Image source={trip.image} style={styles.tripImage} />
              
              {/* Overlay léger */}
              <View style={styles.tripOverlay} />
              
              {/* Informations du trajet */}
              <View style={styles.tripContent}>
                <View style={styles.tripInfo}>
                  <View style={styles.tripTextContainer}>
                    <Text style={styles.tripDestination} numberOfLines={1}>
                      {trip.destination}
                    </Text>
                    <View style={styles.addressRow}>
                      <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.tripAddress} numberOfLines={1}>  {trip.address}</Text>
                    </View>
                    <View style={styles.tripDetailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="navigate" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.detailText}>  {trip.distance}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.detailText}>  {trip.duration}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* Bouton Y aller - PLUS PETIT */}
                <TouchableOpacity 
                  style={styles.navigateButton}
                  onPress={() => handleTripPress(trip)}
                >
                  <Ionicons name="navigate" size={14} color="white" />
                  <Text style={styles.navigateText}>Y aller</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Espace en bas */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Tab Bar en bas */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('home')}
        >
          <Ionicons 
            name={activeTab === 'home' ? "home" : "home-outline"} 
            size={26} 
            color={activeTab === 'home' ? "#1e3a8a" : "#999"} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'home' && styles.tabTextActive
          ]}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('search')}
        >
          <Ionicons 
            name={activeTab === 'search' ? "search" : "search-outline"} 
            size={26} 
            color={activeTab === 'search' ? "#1e3a8a" : "#999"} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'search' && styles.tabTextActive
          ]}>
            Recherche
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItemCenter}
          onPress={() => handleTabPress('add')}
        >
          <View style={styles.addButton}>
            <Ionicons name="navigate" size={30} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('folder')}
        >
          <Ionicons 
            name={activeTab === 'folder' ? "bookmark" : "bookmark-outline"} 
            size={26} 
            color={activeTab === 'folder' ? "#1e3a8a" : "#999"} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'folder' && styles.tabTextActive
          ]}>
            Favoris
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('profile')}
        >
          <Ionicons 
            name={activeTab === 'profile' ? "person" : "person-outline"} 
            size={26} 
            color={activeTab === 'profile' ? "#1e3a8a" : "#999"} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'profile' && styles.tabTextActive
          ]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // En-tête
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    letterSpacing: 2,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Contenu
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  
  // Trajets
  tripsContainer: {
    paddingHorizontal: 20,
  },
  tripCard: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#1e3a8a',
  },
  tripImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 58, 138, 0.6)',
  },
  tripContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripTextContainer: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripAddress: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tripDetailsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  navigateText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  
  bottomSpacer: {
    height: 20,
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 75,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  tabItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  tabText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1e3a8a',
    fontWeight: '700',
  },
});