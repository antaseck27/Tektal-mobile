
// // screens/Accueil.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';


// export default function Accueil({ navigation }) {
//   // Données de chemins (simulées - à remplacer par vraies données)
//   const [paths, setPaths] = useState([
//     {
//       id: '1',
//       title: 'Bakeli → Rond-Point Liberté 6',
//       creator: 'Fatou Sall',
//       duration: '8 min',
//       steps: 4,
//       campus: 'Bakeli Dakar',
//       isOfficial: true,
//       image: require('../../../assets/tektal.jpeg'),
//     },
//     {
//       id: '2',
//       title: 'Campus → Supermarché Auchan',
//       creator: 'Moussa Kane',
//       duration: '12 min',
//       steps: 6,
//       campus: 'Bakeli Dakar',
//       isOfficial: false,
//       image: require('../../../assets/tektal.jpeg'),
//     },
//     {
//       id: '3',
//       title: 'Gare routière → Marché Sandaga',
//       creator: 'Aminata Diop',
//       duration: '15 min',
//       steps: 5,
//       campus: 'Bakeli Thiès',
//       isOfficial: true,
//       image: require('../../../assets/tektal.jpeg'),
//     },
//   ]);


//   const handleOpenPath = (path) => {
//     Alert.alert('Ouvrir chemin', `Lecture de: ${path.title}`);
//   };


//   const handleToggleFavorite = (id) => {
//     Alert.alert('Favoris', 'Chemin ajouté aux favoris');
//   };


//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
//         <View style={styles.headerContent}>
//           <View>
//             <Text style={styles.headerGreeting}>Bonjour 👋</Text>
//             <Text style={styles.headerTitle}>Mamadou</Text>
//           </View>
//           <TouchableOpacity style={styles.notificationButton}>
//             <Ionicons name="notifications-outline" size={24} color="#fff" />
//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationBadgeText}>3</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>


//       {/* Section en vedette */}
//       <View style={styles.featuredSection}>
//         <Text style={styles.sectionTitle}>Chemins populaires</Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.featuredScroll}
//         >
//           {paths.map((path) => (
//             <TouchableOpacity
//               key={path.id}
//               style={styles.featuredCard}
//               onPress={() => handleOpenPath(path)}
//             >
//               <Image source={path.image} style={styles.featuredImage} />
//               <LinearGradient
//                 colors={['transparent', 'rgba(0,0,0,0.8)']}
//                 style={styles.featuredGradient}
//               >
//                 {path.isOfficial && (
//                   <View style={styles.officialBadgeFeatured}>
//                     <Ionicons name="shield-checkmark" size={14} color="#fff" />
//                     <Text style={styles.officialBadgeText}>Officiel</Text>
//                   </View>
//                 )}
//                 <View style={styles.featuredInfo}>
//                   <Text style={styles.featuredTitle} numberOfLines={2}>
//                     {path.title}
//                   </Text>
//                   <View style={styles.featuredMeta}>
//                     <View style={styles.featuredMetaItem}>
//                       <Ionicons name="time-outline" size={14} color="#fff" />
//                       <Text style={styles.featuredMetaText}>
//                         {path.duration}
//                       </Text>
//                     </View>
//                     <View style={styles.featuredMetaItem}>
//                       <Ionicons name="footsteps-outline" size={14} color="#fff" />
//                       <Text style={styles.featuredMetaText}>
//                         {path.steps} étapes
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>


//       {/* Liste des chemins récents */}
//       <View style={styles.recentSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Chemins récents</Text>
//           <TouchableOpacity>
//             <Text style={styles.seeAllText}>Voir tout</Text>
//           </TouchableOpacity>
//         </View>


//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.recentList}
//         >
//           {paths.map((path) => (
//             <TouchableOpacity
//               key={path.id}
//               style={styles.pathCard}
//               onPress={() => handleOpenPath(path)}
//             >
//               <Image source={path.image} style={styles.pathThumbnail} />
//               {path.isOfficial && (
//                 <View style={styles.officialBadgeSmall}>
//                   <Ionicons name="shield-checkmark" size={10} color="#fff" />
//                 </View>
//               )}


//               <View style={styles.pathInfo}>
//                 <Text style={styles.pathTitle} numberOfLines={2}>
//                   {path.title}
//                 </Text>
//                 <Text style={styles.pathCreator}>Par {path.creator}</Text>
//                 <View style={styles.pathMeta}>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="time-outline" size={12} color="#666" />
//                     <Text style={styles.metaText}>{path.duration}</Text>
//                   </View>
//                   <View style={styles.metaItem}>
//                     <Ionicons name="footsteps-outline" size={12} color="#666" />
//                     <Text style={styles.metaText}>{path.steps} étapes</Text>
//                   </View>
//                 </View>
//               </View>


//               <TouchableOpacity
//                 style={styles.favoriteButton}
//                 onPress={() => handleToggleFavorite(path.id)}
//               >
//                 <Ionicons name="heart-outline" size={22} color="#FEBD00" />
//               </TouchableOpacity>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: 24,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerGreeting: {
//     fontSize: 16,
//     color: '#fff',
//     opacity: 0.9,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 4,
//   },
//   notificationButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#FF3B30',
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   featuredSection: {
//     marginTop: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 20,
//     marginBottom: 16,
//   },
//   featuredScroll: {
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   featuredCard: {
//     width: 280,
//     height: 180,
//     borderRadius: 16,
//     marginRight: 16,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//   },
//   featuredImage: {
//     width: '100%',
//     height: '100%',
//   },
//   featuredGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '70%',
//     justifyContent: 'flex-end',
//     padding: 16,
//   },
//   officialBadgeFeatured: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFD700',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 8,
//   },
//   officialBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
//   featuredInfo: {
//     marginTop: 8,
//   },
//   featuredTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 8,
//   },
//   featuredMeta: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   featuredMetaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   featuredMetaText: {
//     color: '#fff',
//     fontSize: 14,
//     marginLeft: 4,
//   },
//   recentSection: {
//     flex: 1,
//     marginTop: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   seeAllText: {
//     color: '#FEBD00',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   recentList: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   pathCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   pathThumbnail: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     position: 'relative',
//   },
//   officialBadgeSmall: {
//     position: 'absolute',
//     top: 16,
//     left: 4,
//     backgroundColor: '#FFD700',
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pathInfo: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: 'center',
//   },
//   pathTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   pathCreator: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   pathMeta: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4,
//   },
//   favoriteButton: {
//     justifyContent: 'center',
//     paddingHorizontal: 8,
//   },
// });





// screens/Accueil.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function Accueil({ navigation }) {
  // Données de chemins (simulées - à remplacer par vraies données)
  const [paths, setPaths] = useState([
    {
      id: '1',
      title: 'Bakeli → Rond-Point Liberté 6',
      creator: 'Fatou Sall',
      duration: '8 min',
      steps: 4,
      campus: 'Bakeli Dakar',
      isOfficial: true,
      image: require('../../../assets/tektal.jpeg'),
    },
    {
      id: '2',
      title: 'Campus → Supermarché Auchan',
      creator: 'Moussa Kane',
      duration: '12 min',
      steps: 6,
      campus: 'Bakeli Dakar',
      isOfficial: false,
      image: require('../../../assets/tektal.jpeg'),
    },
    {
      id: '3',
      title: 'Gare routière → Marché Sandaga',
      creator: 'Aminata Diop',
      duration: '15 min',
      steps: 5,
      campus: 'Bakeli Thiès',
      isOfficial: true,
      image: require('../../../assets/tektal.jpeg'),
    },
  ]);


  const handleOpenPath = (path) => {
    Alert.alert('Ouvrir chemin', `Lecture de: ${path.title}`);
  };


  const handleToggleFavorite = (id) => {
    Alert.alert('Favoris', 'Chemin ajouté aux favoris');
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Bonjour 👋</Text>
            <Text style={styles.headerTitle}>Mamadou</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>


      {/* Section en vedette */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Chemins populaires</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          {paths.map((path) => (
            <TouchableOpacity
              key={path.id}
              style={styles.featuredCard}
              onPress={() => handleOpenPath(path)}
            >
              <Image source={path.image} style={styles.featuredImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredGradient}
              >
                {path.isOfficial && (
                  <View style={styles.officialBadgeFeatured}>
                    <Ionicons name="shield-checkmark" size={14} color="#fff" />
                    <Text style={styles.officialBadgeText}>Officiel</Text>
                  </View>
                )}
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={2}>
                    {path.title}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#fff" />
                      <Text style={styles.featuredMetaText}>
                        {path.duration}
                      </Text>
                    </View>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="footsteps-outline" size={14} color="#fff" />
                      <Text style={styles.featuredMetaText}>
                        {path.steps} étapes
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      {/* Liste des chemins récents */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chemins récents</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recentList}
        >
          {paths.map((path) => (
            <TouchableOpacity
              key={path.id}
              style={styles.pathCard}
              onPress={() => handleOpenPath(path)}
            >
              <Image source={path.image} style={styles.pathThumbnail} />
              {path.isOfficial && (
                <View style={styles.officialBadgeSmall}>
                  <Ionicons name="shield-checkmark" size={10} color="#fff" />
                </View>
              )}


              <View style={styles.pathInfo}>
                <Text style={styles.pathTitle} numberOfLines={2}>
                  {path.title}
                </Text>
                <Text style={styles.pathCreator}>Par {path.creator}</Text>
                <View style={styles.pathMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#666" />
                    <Text style={styles.metaText}>{path.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="footsteps-outline" size={12} color="#666" />
                    <Text style={styles.metaText}>{path.steps} étapes</Text>
                  </View>
                </View>
              </View>


              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(path.id)}
              >
                <Ionicons name="heart-outline" size={22} color="#FEBD00" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 16,
  },
  featuredScroll: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  officialBadgeFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  officialBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  featuredInfo: {
    marginTop: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMetaText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  recentSection: {
    flex: 1,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    color: '#FEBD00',
    fontSize: 14,
    fontWeight: '600',
  },
  recentList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pathCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pathThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    position: 'relative',
  },
  officialBadgeSmall: {
    position: 'absolute',
    top: 16,
    left: 4,
    backgroundColor: '#FFD700',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pathCreator: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pathMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favoriteButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});


