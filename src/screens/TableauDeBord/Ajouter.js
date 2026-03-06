
// // screens/TableauDeBord/Ajouter.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   Alert, ActivityIndicator, Modal, FlatList, TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { getEstablishments } from '../../services/authService';

// export default function Ajouter({ navigation }) {
//   const [departure, setDeparture] = useState('');
//   const [destination, setDestination] = useState('');
//   const [pathType, setPathType] = useState('community');

//   const [destinations, setDestinations] = useState([]); // [{id, name, lat, lng}]
//   const [selectedEstab, setSelectedEstab] = useState(null); // établissement sélectionné
//   const [loadingDestinations, setLoadingDestinations] = useState(true);

//   const [showDestinationModal, setShowDestinationModal] = useState(false);
//   const [showSourceModal, setShowSourceModal] = useState(false);

//   useEffect(() => {
//     loadDestinations();
//   }, []);

//   const loadDestinations = async () => {
//     try {
//       setLoadingDestinations(true);
//       const result = await getEstablishments();

//       console.log('📦 Établissements result.ok:', result.ok);
//       console.log('📦 Établissements data:', JSON.stringify(result.data, null, 2));

//       if (!result.ok) {
//         console.error('❌ API erreur:', result);
//         return;
//       }

//       // Gérer les différentes structures possibles
//       let arr = [];
//       if (Array.isArray(result.data)) {
//         arr = result.data;
//       } else if (Array.isArray(result.data?.results)) {
//         arr = result.data.results;
//       }

//       console.log(`📊 ${arr.length} établissements trouvés`);

//       // Chaque établissement est une destination : { id, name, lat, lng }
//       setDestinations(arr);

//     } catch (e) {
//       console.error('❌ Exception loadDestinations:', e);
//     } finally {
//       setLoadingDestinations(false);
//     }
//   };

//   const validate = () => {
//     if (!departure.trim()) {
//       Alert.alert('Erreur', 'Veuillez saisir un point de départ');
//       return false;
//     }
//     if (!destination || !selectedEstab) {
//       Alert.alert('Erreur', 'Veuillez sélectionner une destination');
//       return false;
//     }
//     if (departure.trim().toLowerCase() === destination.toLowerCase()) {
//       Alert.alert('Erreur', 'Le départ et la destination doivent être différents');
//       return false;
//     }
//     return true;
//   };

//   const handleChooseSource = () => {
//     if (!validate()) return;
//     setShowSourceModal(true);
//   };

//   const handleRecord = () => {
//     setShowSourceModal(false);
//     navigation.navigate('VideoRecorder', {
//       departure: departure.trim(),
//       destination,
//       pathType,
//       videoSource: 'camera',
//       establishmentId: selectedEstab?.id,
//     });
//   };

//   const handleGallery = async () => {
//     setShowSourceModal(false);
//     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!perm.granted) {
//       Alert.alert('Permission refusée', "L'accès à la galerie est requis.");
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: false,
//       quality: 1,
//     });
//     if (!result.canceled && result.assets?.length > 0) {
//       const asset = result.assets[0];
//       navigation.navigate('VideoRecorder', {
//         departure: departure.trim(),
//         destination,
//         pathType,
//         videoSource: 'gallery',
//         establishmentId: selectedEstab?.id,
//         selectedVideo: {
//           uri: asset.uri,
//           duration: asset.duration ? Math.round(asset.duration / 1000) : 30,
//         },
//       });
//     }
//   };

//   return (
//     <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

//       <LinearGradient colors={['#FEBD00', '#FFD700']} style={s.header}>
//         <Text style={s.headerTitle}>Créer un chemin</Text>
//         <Text style={s.headerSubtitle}>Aidez la communauté à se déplacer</Text>
//       </LinearGradient>

//       <View style={s.form}>

//         {/* Départ — saisie libre */}
//         <View style={s.group}>
//           <Text style={s.label}>
//             <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
//           </Text>
//           <View style={[s.row, departure.trim() && s.rowGreen]}>
//             <Ionicons name="location" size={20} color={departure.trim() ? '#34C759' : '#ccc'} />
//             <TextInput
//               style={s.input}
//               placeholder="Ex: Entrée principale, Bloc A..."
//               placeholderTextColor="#999"
//               value={departure}
//               onChangeText={setDeparture}
//             />
//             {departure.length > 0 && (
//               <TouchableOpacity onPress={() => setDeparture('')}>
//                 <Ionicons name="close-circle" size={18} color="#ccc" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Destination — sélection dynamique */}
//         <View style={s.group}>
//           <Text style={s.label}>
//             <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
//           </Text>
//           <TouchableOpacity
//             style={[s.row, destination && s.rowYellow]}
//             onPress={() => setShowDestinationModal(true)}
//           >
//             <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
//             <Text style={[s.selectorTxt, !destination && s.placeholder]}>
//               {destination || 'Sélectionner une destination...'}
//             </Text>
//             {loadingDestinations
//               ? <ActivityIndicator size="small" color="#FEBD00" />
//               : <Ionicons name="chevron-down" size={18} color="#999" />
//             }
//           </TouchableOpacity>
//         </View>

//         {/* Aperçu trajet */}
//         {departure.trim() !== '' && destination !== '' && (
//           <View style={s.preview}>
//             <Ionicons name="navigate" size={18} color="#FEBD00" />
//             <Text style={s.previewTxt}>{departure.trim()} → {destination}</Text>
//           </View>
//         )}

//         {/* Type de chemin */}
//         <View style={s.group}>
//           <Text style={s.label}>Type de chemin</Text>
//           <View style={s.typeRow}>
//             {[
//               { key: 'community', icon: 'people-outline', label: 'Communautaire', desc: 'Partagé avec tous' },
//               { key: 'official', icon: 'shield-checkmark-outline', label: 'Officiel', desc: 'Vérifié par votre établissement' },
//             ].map((t) => (
//               <TouchableOpacity
//                 key={t.key}
//                 style={[s.typeCard, pathType === t.key && s.typeCardActive]}
//                 onPress={() => setPathType(t.key)}
//               >
//                 <Ionicons name={t.icon} size={30} color={pathType === t.key ? '#FEBD00' : '#666'} />
//                 <Text style={[s.typeLabel, pathType === t.key && s.typeLabelActive]}>{t.label}</Text>
//                 <Text style={s.typeDesc}>{t.desc}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Instructions */}
//         <View style={s.infoCard}>
//           <Text style={s.infoTitle}>
//             <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
//           </Text>
//           {[
//             'Saisissez votre point de départ',
//             'Sélectionnez la destination dans la liste',
//             'Choisissez la source de la vidéo',
//             'Découpez en 2 à 6 étapes et publiez !',
//           ].map((txt, i) => (
//             <View key={i} style={s.infoItem}>
//               <View style={s.infoNum}><Text style={s.infoNumTxt}>{i + 1}</Text></View>
//               <Text style={s.infoTxt}>{txt}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Bouton principal */}
//         <TouchableOpacity style={s.btn} onPress={handleChooseSource}>
//           <Ionicons name="add-circle-outline" size={24} color="#fff" />
//           <Text style={s.btnTxt}>Choisir la source de la vidéo</Text>
//         </TouchableOpacity>

//       </View>

//       {/* ══ MODAL DESTINATION ══ */}
//       <Modal
//         visible={showDestinationModal}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setShowDestinationModal(false)}
//       >
//         <View style={s.overlay}>
//           <View style={s.sheet}>
//             <View style={s.sheetHeader}>
//               <Text style={s.sheetTitle}>Choisir la destination</Text>
//               <TouchableOpacity onPress={() => setShowDestinationModal(false)} style={s.closeBtn}>
//                 <Ionicons name="close" size={22} color="#333" />
//               </TouchableOpacity>
//             </View>

//             {loadingDestinations ? (
//               <View style={s.center}>
//                 <ActivityIndicator size="large" color="#FEBD00" />
//                 <Text style={s.centerTxt}>Chargement des destinations...</Text>
//               </View>
//             ) : destinations.length === 0 ? (
//               <View style={s.center}>
//                 <Ionicons name="location-outline" size={48} color="#ccc" />
//                 <Text style={s.centerTxt}>Aucune destination disponible</Text>
//                 <TouchableOpacity onPress={loadDestinations} style={s.retryBtn}>
//                   <Ionicons name="refresh" size={16} color="#FEBD00" />
//                   <Text style={s.retryTxt}>Réessayer</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <FlatList
//                 data={destinations}
//                 keyExtractor={(item) => String(item.id)}
//                 contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
//                 renderItem={({ item }) => {
//                   const sel = selectedEstab?.id === item.id;
//                   return (
//                     <TouchableOpacity
//                       style={[s.listItem, sel && s.listItemSel]}
//                       onPress={() => {
//                         setDestination(item.name);
//                         setSelectedEstab(item);
//                         setShowDestinationModal(false);
//                       }}
//                     >
//                       <Ionicons
//                         name={sel ? 'radio-button-on' : 'radio-button-off'}
//                         size={20}
//                         color={sel ? '#FEBD00' : '#ccc'}
//                       />
//                       <View style={{ flex: 1 }}>
//                         <Text style={[s.listItemTxt, sel && s.listItemTxtSel]}>{item.name}</Text>
//                         {item.lat && item.lng && (
//                           <Text style={s.listItemCoords}>
//                             {parseFloat(item.lat).toFixed(4)}, {parseFloat(item.lng).toFixed(4)}
//                           </Text>
//                         )}
//                       </View>
//                       {sel && <Ionicons name="checkmark" size={18} color="#FEBD00" />}
//                     </TouchableOpacity>
//                   );
//                 }}
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* ══ MODAL SOURCE VIDÉO ══ */}
//       <Modal
//         visible={showSourceModal}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setShowSourceModal(false)}
//       >
//         <View style={s.overlay}>
//           <View style={s.sourceSheet}>
//             <Text style={s.sourceTitle}>Choisir la source de la vidéo</Text>

//             <TouchableOpacity style={s.sourceOption} onPress={handleRecord}>
//               <View style={[s.sourceIcon, { backgroundColor: '#FF3B30' }]}>
//                 <Ionicons name="videocam" size={26} color="#fff" />
//               </View>
//               <View style={s.sourceTxt}>
//                 <Text style={s.sourceOptTitle}>Enregistrement</Text>
//                 <Text style={s.sourceOptDesc}>Filmez le trajet en temps réel</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color="#ccc" />
//             </TouchableOpacity>

//             <TouchableOpacity style={s.sourceOption} onPress={handleGallery}>
//               <View style={[s.sourceIcon, { backgroundColor: '#007AFF' }]}>
//                 <Ionicons name="images" size={26} color="#fff" />
//               </View>
//               <View style={s.sourceTxt}>
//                 <Text style={s.sourceOptTitle}>Galerie</Text>
//                 <Text style={s.sourceOptDesc}>Choisissez une vidéo existante</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color="#ccc" />
//             </TouchableOpacity>

//             <TouchableOpacity style={s.cancelBtn} onPress={() => setShowSourceModal(false)}>
//               <Text style={s.cancelTxt}>Annuler</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//     </ScrollView>
//   );
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
//   headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
//   headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
//   form: { padding: 20 },
//   group: { marginBottom: 24 },
//   label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
//   row: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
//     borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
//     borderWidth: 1, borderColor: '#e0e0e0', gap: 10,
//   },
//   rowGreen: { borderColor: '#34C759', backgroundColor: '#F0FFF4' },
//   rowYellow: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
//   input: { flex: 1, fontSize: 16, color: '#333' },
//   selectorTxt: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
//   placeholder: { color: '#999', fontWeight: '400' },
//   preview: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF4D6',
//     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
//     marginBottom: 24, gap: 8, borderWidth: 1, borderColor: '#FFE082',
//   },
//   previewTxt: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
//   typeRow: { flexDirection: 'row', gap: 12 },
//   typeCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
//   typeCardActive: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
//   typeLabel: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 8, marginBottom: 4 },
//   typeLabelActive: { color: '#FEBD00' },
//   typeDesc: { fontSize: 12, color: '#666', textAlign: 'center' },
//   infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#FFF4D6' },
//   infoTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 16 },
//   infoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
//   infoNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   infoNumTxt: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
//   infoTxt: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20, paddingTop: 4 },
//   btn: {
//     flexDirection: 'row', backgroundColor: '#FEBD00', padding: 18, borderRadius: 12,
//     alignItems: 'center', justifyContent: 'center', gap: 10,
//     shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginBottom: 40,
//   },
//   btnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
//   sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
//   center: { padding: 40, alignItems: 'center', gap: 12 },
//   centerTxt: { fontSize: 14, color: '#999', textAlign: 'center' },
//   retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FEBD00', marginTop: 8 },
//   retryTxt: { color: '#FEBD00', fontSize: 14, fontWeight: '600' },
//   listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 4 },
//   listItemSel: { backgroundColor: '#FFFBF0' },
//   listItemTxt: { flex: 1, fontSize: 16, color: '#333' },
//   listItemTxtSel: { fontWeight: '600', color: '#FEBD00' },
//   listItemCoords: { fontSize: 11, color: '#999', marginTop: 2 },
//   sourceSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
//   sourceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
//   sourceOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 14, padding: 16, marginBottom: 12, gap: 14, borderWidth: 1, borderColor: '#f0f0f0' },
//   sourceIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
//   sourceTxt: { flex: 1 },
//   sourceOptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   sourceOptDesc: { fontSize: 13, color: '#999', marginTop: 2 },
//   cancelBtn: { marginTop: 4, paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#f5f5f5' },
//   cancelTxt: { fontSize: 16, fontWeight: '600', color: '#666' },
// });




// screens/TableauDeBord/Ajouter.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Modal, FlatList, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getEstablishments } from '../../services/authService';

export default function Ajouter({ navigation }) {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [pathType, setPathType] = useState('community');

  const [destinations, setDestinations] = useState([]); // [{id, name, lat, lng}]
  const [selectedEstab, setSelectedEstab] = useState(null); // établissement sélectionné
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const [showDestinationModal, setShowDestinationModal] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const result = await getEstablishments();

      console.log('📦 Établissements result.ok:', result.ok);
      console.log('📦 Établissements data:', JSON.stringify(result.data, null, 2));

      if (!result.ok) {
        console.error('❌ API erreur:', result);
        return;
      }

      // Gérer les différentes structures possibles
      let arr = [];
      if (Array.isArray(result.data)) {
        arr = result.data;
      } else if (Array.isArray(result.data?.results)) {
        arr = result.data.results;
      }

      console.log(`📊 ${arr.length} établissements trouvés`);

      // Chaque établissement est une destination : { id, name, lat, lng }
      setDestinations(arr);

    } catch (e) {
      console.error('❌ Exception loadDestinations:', e);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const validate = () => {
    if (!departure.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un point de départ');
      return false;
    }
    if (!destination || !selectedEstab) {
      Alert.alert('Erreur', 'Veuillez sélectionner une destination');
      return false;
    }
    if (departure.trim().toLowerCase() === destination.toLowerCase()) {
      Alert.alert('Erreur', 'Le départ et la destination doivent être différents');
      return false;
    }
    return true;
  };

  const handleRecord = () => {
    if (!validate()) return;
    navigation.navigate('VideoRecorder', {
      departure: departure.trim(),
      destination,
      pathType,
      videoSource: 'camera',
      establishmentId: selectedEstab?.id,
    });
  };


  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      <LinearGradient colors={['#FEBD00', '#FFD700']} style={s.header}>
        <Text style={s.headerTitle}>Créer un chemin</Text>
        <Text style={s.headerSubtitle}>Aidez la communauté à se déplacer</Text>
      </LinearGradient>

      <View style={s.form}>

        {/* Départ — saisie libre */}
        <View style={s.group}>
          <Text style={s.label}>
            <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
          </Text>
          <View style={[s.row, departure.trim() && s.rowGreen]}>
            <Ionicons name="location" size={20} color={departure.trim() ? '#34C759' : '#ccc'} />
            <TextInput
              style={s.input}
              placeholder="Ex: Entrée principale, Bloc A..."
              placeholderTextColor="#999"
              value={departure}
              onChangeText={setDeparture}
            />
            {departure.length > 0 && (
              <TouchableOpacity onPress={() => setDeparture('')}>
                <Ionicons name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Destination — sélection dynamique */}
        <View style={s.group}>
          <Text style={s.label}>
            <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
          </Text>
          <TouchableOpacity
            style={[s.row, destination && s.rowYellow]}
            onPress={() => setShowDestinationModal(true)}
          >
            <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
            <Text style={[s.selectorTxt, !destination && s.placeholder]}>
              {destination || 'Sélectionner une destination...'}
            </Text>
            {loadingDestinations
              ? <ActivityIndicator size="small" color="#FEBD00" />
              : <Ionicons name="chevron-down" size={18} color="#999" />
            }
          </TouchableOpacity>
        </View>

        {/* Aperçu trajet */}
        {departure.trim() !== '' && destination !== '' && (
          <View style={s.preview}>
            <Ionicons name="navigate" size={18} color="#FEBD00" />
            <Text style={s.previewTxt}>{departure.trim()} → {destination}</Text>
          </View>
        )}

        {/* Type de chemin */}
        <View style={s.group}>
          <Text style={s.label}>Type de chemin</Text>
          <View style={s.typeRow}>
            {[
              { key: 'community', icon: 'people-outline', label: 'Communautaire', desc: 'Partagé avec tous' },
              { key: 'official', icon: 'shield-checkmark-outline', label: 'Officiel', desc: 'Vérifié par votre établissement' },
            ].map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[s.typeCard, pathType === t.key && s.typeCardActive]}
                onPress={() => setPathType(t.key)}
              >
                <Ionicons name={t.icon} size={30} color={pathType === t.key ? '#FEBD00' : '#666'} />
                <Text style={[s.typeLabel, pathType === t.key && s.typeLabelActive]}>{t.label}</Text>
                <Text style={s.typeDesc}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>
            <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
          </Text>
          {[
            'Saisissez votre point de départ',
            'Sélectionnez la destination dans la liste',
            'Choisissez la source de la vidéo',
            'Découpez en 2 à 6 étapes et publiez !',
          ].map((txt, i) => (
            <View key={i} style={s.infoItem}>
              <View style={s.infoNum}><Text style={s.infoNumTxt}>{i + 1}</Text></View>
              <Text style={s.infoTxt}>{txt}</Text>
            </View>
          ))}
        </View>

        {/* Bouton principal */}
        <TouchableOpacity style={s.btn} onPress={handleRecord}>
          <Ionicons name="videocam" size={24} color="#fff" />
          <Text style={s.btnTxt}>Enregistrer la vidéo</Text>
        </TouchableOpacity>

      </View>

      {/* ══ MODAL DESTINATION ══ */}
      <Modal
        visible={showDestinationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDestinationModal(false)}
      >
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Choisir la destination</Text>
              <TouchableOpacity onPress={() => setShowDestinationModal(false)} style={s.closeBtn}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {loadingDestinations ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color="#FEBD00" />
                <Text style={s.centerTxt}>Chargement des destinations...</Text>
              </View>
            ) : destinations.length === 0 ? (
              <View style={s.center}>
                <Ionicons name="location-outline" size={48} color="#ccc" />
                <Text style={s.centerTxt}>Aucune destination disponible</Text>
                <TouchableOpacity onPress={loadDestinations} style={s.retryBtn}>
                  <Ionicons name="refresh" size={16} color="#FEBD00" />
                  <Text style={s.retryTxt}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={destinations}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                renderItem={({ item }) => {
                  const sel = selectedEstab?.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[s.listItem, sel && s.listItemSel]}
                      onPress={() => {
                        setDestination(item.name);
                        setSelectedEstab(item);
                        setShowDestinationModal(false);
                      }}
                    >
                      <Ionicons
                        name={sel ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={sel ? '#FEBD00' : '#ccc'}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[s.listItemTxt, sel && s.listItemTxtSel]}>{item.name}</Text>
                        {item.lat && item.lng && (
                          <Text style={s.listItemCoords}>
                            {parseFloat(item.lat).toFixed(4)}, {parseFloat(item.lng).toFixed(4)}
                          </Text>
                        )}
                      </View>
                      {sel && <Ionicons name="checkmark" size={18} color="#FEBD00" />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>


    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  form: { padding: 20 },
  group: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#e0e0e0', gap: 10,
  },
  rowGreen: { borderColor: '#34C759', backgroundColor: '#F0FFF4' },
  rowYellow: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
  input: { flex: 1, fontSize: 16, color: '#333' },
  selectorTxt: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  placeholder: { color: '#999', fontWeight: '400' },
  preview: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF4D6',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 24, gap: 8, borderWidth: 1, borderColor: '#FFE082',
  },
  previewTxt: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  typeCardActive: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
  typeLabel: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 8, marginBottom: 4 },
  typeLabelActive: { color: '#FEBD00' },
  typeDesc: { fontSize: 12, color: '#666', textAlign: 'center' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#FFF4D6' },
  infoTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  infoNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoNumTxt: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  infoTxt: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20, paddingTop: 4 },
  btn: {
    flexDirection: 'row', backgroundColor: '#FEBD00', padding: 18, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginBottom: 40,
  },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  center: { padding: 40, alignItems: 'center', gap: 12 },
  centerTxt: { fontSize: 14, color: '#999', textAlign: 'center' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FEBD00', marginTop: 8 },
  retryTxt: { color: '#FEBD00', fontSize: 14, fontWeight: '600' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 4 },
  listItemSel: { backgroundColor: '#FFFBF0' },
  listItemTxt: { flex: 1, fontSize: 16, color: '#333' },
  listItemTxtSel: { fontWeight: '600', color: '#FEBD00' },
  listItemCoords: { fontSize: 11, color: '#999', marginTop: 2 },
  sourceSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  sourceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  sourceOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 14, padding: 16, marginBottom: 12, gap: 14, borderWidth: 1, borderColor: '#f0f0f0' },
  sourceIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  sourceTxt: { flex: 1 },
  sourceOptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sourceOptDesc: { fontSize: 13, color: '#999', marginTop: 2 },
  cancelBtn: { marginTop: 4, paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#f5f5f5' },
  cancelTxt: { fontSize: 16, fontWeight: '600', color: '#666' },
});