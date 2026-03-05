


// // screens/TableauDeBord/Ajouter.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   Alert, ActivityIndicator, Modal, FlatList, TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { getPaths } from '../../services/authService';

// export default function Ajouter({ navigation }) {
//   const [departure, setDeparture] = useState('');
//   const [destination, setDestination] = useState('');
//   const [pathType, setPathType] = useState('community');
//   const [locations, setLocations] = useState([]);
//   const [loadingLocations, setLoadingLocations] = useState(true);
//   const [showDestinationModal, setShowDestinationModal] = useState(false);
//   const [showSourceModal, setShowSourceModal] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const result = await getPaths();
//         if (result.ok && result.data) {
//           const arr = Array.isArray(result.data.results)
//             ? result.data.results
//             : Array.isArray(result.data) ? result.data : [];
//           const labels = new Set();
//           arr.forEach((p) => {
//             if (p.start_label) labels.add(p.start_label.trim());
//             if (p.end_label) labels.add(p.end_label.trim());
//           });
//           setLocations([...labels].sort());
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoadingLocations(false);
//       }
//     })();
//   }, []);

//   const validate = () => {
//     if (!departure.trim() || !destination) {
//       Alert.alert('Erreur', 'Veuillez renseigner le départ et sélectionner une destination');
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

//   // ✅ Enregistrement caméra
//   const handleRecord = () => {
//     setShowSourceModal(false);
//     navigation.navigate('VideoRecorder', {
//       departure: departure.trim(),
//       destination,
//       pathType,
//       videoSource: 'camera',
//     });
//   };

//   // ✅ Galerie → va directement à StepCreation
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
//       const durationSec = asset.duration ? Math.round(asset.duration / 1000) : 30;
//       navigation.navigate('VideoRecorder', {
//         departure: departure.trim(),
//         destination,
//         pathType,
//         videoSource: 'gallery',
//         selectedVideo: { uri: asset.uri, duration: durationSec },
//       });
//     }
//   };

//   return (
//     <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

//       {/* Header */}
//       <LinearGradient colors={['#FEBD00', '#FFD700']} style={s.header}>
//         <Text style={s.headerTitle}>Créer un chemin</Text>
//         <Text style={s.headerSubtitle}>Aidez la communauté à se déplacer</Text>
//       </LinearGradient>

//       <View style={s.form}>

//         {/* ── Départ (saisissable librement) ── */}
//         <View style={s.group}>
//           <Text style={s.label}>
//             <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
//           </Text>
//           <View style={[s.inputRow, departure ? s.inputRowGreen : null]}>
//             <Ionicons name="location" size={20} color={departure ? '#34C759' : '#ccc'} />
//             <TextInput
//               style={s.input}
//               placeholder="Ex: Bakeli Dakar"
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

//         {/* ── Destination (sélectionnable depuis la base) ── */}
//         <View style={s.group}>
//           <Text style={s.label}>
//             <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
//           </Text>
//           <TouchableOpacity
//             style={[s.inputRow, destination ? s.inputRowYellow : null]}
//             onPress={() => setShowDestinationModal(true)}
//           >
//             <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
//             <Text style={[s.selectorTxt, !destination && s.placeholder]}>
//               {destination || 'Sélectionner une destination...'}
//             </Text>
//             <Ionicons name="chevron-down" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>

//         {/* Aperçu trajet */}
//         {departure.trim() !== '' && destination !== '' && (
//           <View style={s.preview}>
//             <Ionicons name="navigate" size={18} color="#FEBD00" />
//             <Text style={s.previewTxt}>{departure.trim()} → {destination}</Text>
//           </View>
//         )}

//         {/* ── Type de chemin ── */}
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

//         {/* ── Instructions ── */}
//         <View style={s.infoCard}>
//           <Text style={s.infoTitle}>
//             <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
//           </Text>
//           {[
//             'Choisissez la source de votre vidéo (caméra ou galerie)',
//             'Découpez en 2 à 6 étapes importantes',
//             'Ajoutez des instructions pour chaque étape',
//             'Publiez et aidez la communauté !',
//           ].map((txt, i) => (
//             <View key={i} style={s.infoItem}>
//               <View style={s.infoNum}><Text style={s.infoNumTxt}>{i + 1}</Text></View>
//               <Text style={s.infoTxt}>{txt}</Text>
//             </View>
//           ))}
//         </View>

//         {/* ── Bouton principal ── */}
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

//             {loadingLocations ? (
//               <View style={s.center}>
//                 <ActivityIndicator size="large" color="#FEBD00" />
//                 <Text style={s.centerTxt}>Chargement...</Text>
//               </View>
//             ) : locations.length === 0 ? (
//               <View style={s.center}>
//                 <Ionicons name="location-outline" size={48} color="#ccc" />
//                 <Text style={s.centerTxt}>Aucune destination disponible</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={locations}
//                 keyExtractor={(item) => item}
//                 contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
//                 renderItem={({ item }) => {
//                   const sel = item === destination;
//                   return (
//                     <TouchableOpacity
//                       style={[s.listItem, sel && s.listItemSel]}
//                       onPress={() => { setDestination(item); setShowDestinationModal(false); }}
//                     >
//                       <Ionicons
//                         name={sel ? 'radio-button-on' : 'radio-button-off'}
//                         size={20}
//                         color={sel ? '#FEBD00' : '#ccc'}
//                       />
//                       <Text style={[s.listItemTxt, sel && s.listItemTxtSel]}>{item}</Text>
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

//   inputRow: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
//     borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
//     borderWidth: 1, borderColor: '#e0e0e0', gap: 10,
//   },
//   inputRowGreen: { borderColor: '#34C759', backgroundColor: '#F0FFF4' },
//   inputRowYellow: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
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
//   typeCard: {
//     flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16,
//     alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0',
//   },
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

//   sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
//   sheetHeader: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 20, paddingVertical: 16,
//     borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
//   },
//   sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },

//   center: { padding: 40, alignItems: 'center', gap: 12 },
//   centerTxt: { fontSize: 14, color: '#999' },

//   listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 4 },
//   listItemSel: { backgroundColor: '#FFFBF0' },
//   listItemTxt: { flex: 1, fontSize: 16, color: '#333' },
//   listItemTxtSel: { fontWeight: '600', color: '#FEBD00' },

//   sourceSheet: {
//     backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
//   },
//   sourceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
//   sourceOption: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9',
//     borderRadius: 14, padding: 16, marginBottom: 12, gap: 14,
//     borderWidth: 1, borderColor: '#f0f0f0',
//   },
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
import * as ImagePicker from 'expo-image-picker';
import { getEstablishments, getPathsByEstablishment } from '../../services/authService';

export default function Ajouter({ navigation }) {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [pathType, setPathType] = useState('community');

  // Établissements
  const [establishments, setEstablishments] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [loadingEstablishments, setLoadingEstablishments] = useState(true);
  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);

  // Destinations (depuis les chemins de l'établissement)
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);

  // 1. Charger les établissements au démarrage
  useEffect(() => {
    (async () => {
      try {
        const result = await getEstablishments();
        if (result.ok && result.data) {
          const arr = Array.isArray(result.data.results)
            ? result.data.results
            : Array.isArray(result.data) ? result.data : [];
          setEstablishments(arr);
        }
      } catch (e) {
        console.error('❌ Erreur établissements:', e);
      } finally {
        setLoadingEstablishments(false);
      }
    })();
  }, []);

  // 2. Quand l'établissement change → charger ses destinations
  const handleSelectEstablishment = async (estab) => {
    setSelectedEstablishment(estab);
    setDestination('');
    setLocations([]);
    setShowEstablishmentModal(false);
    setLoadingLocations(true);

    try {
      const result = await getPathsByEstablishment(estab.id);
      if (result.ok && result.data) {
        const arr = Array.isArray(result.data.results)
          ? result.data.results
          : Array.isArray(result.data) ? result.data : [];
        const labels = new Set();
        arr.forEach((p) => {
          if (p.start_label) labels.add(p.start_label.trim());
          if (p.end_label) labels.add(p.end_label.trim());
        });
        setLocations([...labels].sort());
      }
    } catch (e) {
      console.error('❌ Erreur chemins établissement:', e);
    } finally {
      setLoadingLocations(false);
    }
  };

  const validate = () => {
    if (!selectedEstablishment) {
      Alert.alert('Erreur', 'Veuillez sélectionner un établissement');
      return false;
    }
    if (!departure.trim() || !destination) {
      Alert.alert('Erreur', 'Veuillez renseigner le départ et sélectionner une destination');
      return false;
    }
    if (departure.trim().toLowerCase() === destination.toLowerCase()) {
      Alert.alert('Erreur', 'Le départ et la destination doivent être différents');
      return false;
    }
    return true;
  };

  const handleChooseSource = () => {
    if (!validate()) return;
    setShowSourceModal(true);
  };

  const handleRecord = () => {
    setShowSourceModal(false);
    navigation.navigate('VideoRecorder', {
      departure: departure.trim(),
      destination,
      pathType,
      videoSource: 'camera',
      establishmentId: selectedEstablishment?.id,
    });
  };

  const handleGallery = async () => {
    setShowSourceModal(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission refusée', "L'accès à la galerie est requis.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const durationSec = asset.duration ? Math.round(asset.duration / 1000) : 30;
      navigation.navigate('VideoRecorder', {
        departure: departure.trim(),
        destination,
        pathType,
        videoSource: 'gallery',
        selectedVideo: { uri: asset.uri, duration: durationSec },
        establishmentId: selectedEstablishment?.id,
      });
    }
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient colors={['#FEBD00', '#FFD700']} style={s.header}>
        <Text style={s.headerTitle}>Créer un chemin</Text>
        <Text style={s.headerSubtitle}>Aidez la communauté à se déplacer</Text>
      </LinearGradient>

      <View style={s.form}>

        {/* ── Établissement ── */}
        <View style={s.group}>
          <Text style={s.label}>
            <Ionicons name="business-outline" size={16} color="#FEBD00" /> Établissement
          </Text>
          {loadingEstablishments ? (
            <ActivityIndicator color="#FEBD00" />
          ) : (
            <TouchableOpacity
              style={[s.inputRow, selectedEstablishment ? s.inputRowYellow : null]}
              onPress={() => setShowEstablishmentModal(true)}
            >
              <Ionicons name="business" size={20} color={selectedEstablishment ? '#FEBD00' : '#ccc'} />
              <Text style={[s.selectorTxt, !selectedEstablishment && s.placeholder]}>
                {selectedEstablishment ? selectedEstablishment.name : 'Sélectionner un établissement...'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Départ (saisissable librement) ── */}
        <View style={s.group}>
          <Text style={s.label}>
            <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
          </Text>
          <View style={[s.inputRow, departure ? s.inputRowGreen : null]}>
            <Ionicons name="location" size={20} color={departure ? '#34C759' : '#ccc'} />
            <TextInput
              style={s.input}
              placeholder="Ex: Bakeli Dakar"
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

        {/* ── Destination ── */}
        <View style={s.group}>
          <Text style={s.label}>
            <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
          </Text>
          <TouchableOpacity
            style={[s.inputRow, destination ? s.inputRowYellow : null]}
            onPress={() => selectedEstablishment
              ? setShowDestinationModal(true)
              : Alert.alert('Attention', 'Sélectionnez d\'abord un établissement')
            }
          >
            <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
            <Text style={[s.selectorTxt, !destination && s.placeholder]}>
              {loadingLocations
                ? 'Chargement des destinations...'
                : destination || 'Sélectionner une destination...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Aperçu trajet */}
        {departure.trim() !== '' && destination !== '' && (
          <View style={s.preview}>
            <Ionicons name="navigate" size={18} color="#FEBD00" />
            <Text style={s.previewTxt}>{departure.trim()} → {destination}</Text>
          </View>
        )}

        {/* ── Type de chemin ── */}
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

        {/* ── Instructions ── */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>
            <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
          </Text>
          {[
            'Choisissez votre établissement',
            'Sélectionnez la destination dans la liste',
            'Découpez en 2 à 6 étapes importantes',
            'Publiez et aidez la communauté !',
          ].map((txt, i) => (
            <View key={i} style={s.infoItem}>
              <View style={s.infoNum}><Text style={s.infoNumTxt}>{i + 1}</Text></View>
              <Text style={s.infoTxt}>{txt}</Text>
            </View>
          ))}
        </View>

        {/* ── Bouton principal ── */}
        <TouchableOpacity style={s.btn} onPress={handleChooseSource}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={s.btnTxt}>Choisir la source de la vidéo</Text>
        </TouchableOpacity>

      </View>

      {/* ══ MODAL ÉTABLISSEMENT ══ */}
      <Modal
        visible={showEstablishmentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEstablishmentModal(false)}
      >
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Choisir l'établissement</Text>
              <TouchableOpacity onPress={() => setShowEstablishmentModal(false)} style={s.closeBtn}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            {establishments.length === 0 ? (
              <View style={s.center}>
                <Ionicons name="business-outline" size={48} color="#ccc" />
                <Text style={s.centerTxt}>Aucun établissement disponible</Text>
              </View>
            ) : (
              <FlatList
                data={establishments}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                renderItem={({ item }) => {
                  const sel = selectedEstablishment?.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[s.listItem, sel && s.listItemSel]}
                      onPress={() => handleSelectEstablishment(item)}
                    >
                      <Ionicons
                        name={sel ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={sel ? '#FEBD00' : '#ccc'}
                      />
                      <Text style={[s.listItemTxt, sel && s.listItemTxtSel]}>{item.name}</Text>
                      {sel && <Ionicons name="checkmark" size={18} color="#FEBD00" />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

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
            {loadingLocations ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color="#FEBD00" />
                <Text style={s.centerTxt}>Chargement...</Text>
              </View>
            ) : locations.length === 0 ? (
              <View style={s.center}>
                <Ionicons name="location-outline" size={48} color="#ccc" />
                <Text style={s.centerTxt}>Aucune destination disponible pour cet établissement</Text>
              </View>
            ) : (
              <FlatList
                data={locations}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                renderItem={({ item }) => {
                  const sel = item === destination;
                  return (
                    <TouchableOpacity
                      style={[s.listItem, sel && s.listItemSel]}
                      onPress={() => { setDestination(item); setShowDestinationModal(false); }}
                    >
                      <Ionicons
                        name={sel ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={sel ? '#FEBD00' : '#ccc'}
                      />
                      <Text style={[s.listItemTxt, sel && s.listItemTxtSel]}>{item}</Text>
                      {sel && <Ionicons name="checkmark" size={18} color="#FEBD00" />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ══ MODAL SOURCE VIDÉO ══ */}
      <Modal
        visible={showSourceModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={s.overlay}>
          <View style={s.sourceSheet}>
            <Text style={s.sourceTitle}>Choisir la source de la vidéo</Text>
            <TouchableOpacity style={s.sourceOption} onPress={handleRecord}>
              <View style={[s.sourceIcon, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="videocam" size={26} color="#fff" />
              </View>
              <View style={s.sourceTxt}>
                <Text style={s.sourceOptTitle}>Enregistrement</Text>
                <Text style={s.sourceOptDesc}>Filmez le trajet en temps réel</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={s.sourceOption} onPress={handleGallery}>
              <View style={[s.sourceIcon, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="images" size={26} color="#fff" />
              </View>
              <View style={s.sourceTxt}>
                <Text style={s.sourceOptTitle}>Galerie</Text>
                <Text style={s.sourceOptDesc}>Choisissez une vidéo existante</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowSourceModal(false)}>
              <Text style={s.cancelTxt}>Annuler</Text>
            </TouchableOpacity>
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
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#e0e0e0', gap: 10,
  },
  inputRowGreen: { borderColor: '#34C759', backgroundColor: '#F0FFF4' },
  inputRowYellow: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
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
  typeCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0',
  },
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
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  center: { padding: 40, alignItems: 'center', gap: 12 },
  centerTxt: { fontSize: 14, color: '#999', textAlign: 'center' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 4 },
  listItemSel: { backgroundColor: '#FFFBF0' },
  listItemTxt: { flex: 1, fontSize: 16, color: '#333' },
  listItemTxtSel: { fontWeight: '600', color: '#FEBD00' },
  sourceSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
  },
  sourceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  sourceOption: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9',
    borderRadius: 14, padding: 16, marginBottom: 12, gap: 14,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  sourceIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  sourceTxt: { flex: 1 },
  sourceOptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sourceOptDesc: { fontSize: 13, color: '#999', marginTop: 2 },
  cancelBtn: { marginTop: 4, paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#f5f5f5' },
  cancelTxt: { fontSize: 16, fontWeight: '600', color: '#666' },
});

// // screens/TableauDeBord/Ajouter.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { getPaths } from '../../services/authService';

// export default function Ajouter({ navigation }) {
//   const [departure, setDeparture] = useState('');
//   const [destination, setDestination] = useState('');
//   const [pathType, setPathType] = useState('community');

//   const [locations, setLocations] = useState([]);
//   const [loadingLocations, setLoadingLocations] = useState(true);

//   const [showDepartureModal, setShowDepartureModal] = useState(false);
//   const [showDestinationModal, setShowDestinationModal] = useState(false);

//   useEffect(() => {
//     const loadLocations = async () => {
//       try {
//         setLoadingLocations(true);
//         const result = await getPaths();

//         if (result.ok && result.data) {
//           const pathsArray = Array.isArray(result.data.results)
//             ? result.data.results
//             : Array.isArray(result.data)
//             ? result.data
//             : [];

//           const allLabels = new Set();
//           pathsArray.forEach((path) => {
//             if (path.start_label) allLabels.add(path.start_label.trim());
//             if (path.end_label) allLabels.add(path.end_label.trim());
//           });

//           setLocations([...allLabels].sort());
//         }
//       } catch (e) {
//         console.error('Erreur chargement destinations:', e);
//       } finally {
//         setLoadingLocations(false);
//       }
//     };

//     loadLocations();
//   }, []);

//   const validatePathInputs = () => {
//     if (!departure || !destination) {
//       Alert.alert('Erreur', 'Veuillez sélectionner un point de départ et une destination');
//       return false;
//     }
//     if (departure === destination) {
//       Alert.alert('Erreur', 'Le départ et la destination doivent être différents');
//       return false;
//     }
//     return true;
//   };

//   const handleStartRecording = () => {
//     if (!validatePathInputs()) return;

//     navigation.navigate('VideoRecorder', {
//       departure,
//       destination,
//       pathType,
//       videoSource: 'camera',
//     });
//   };

//   const handlePickFromGallery = async () => {
//     if (!validatePathInputs()) return;

//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert(
//         'Permission requise',
//         'Autorisez l’accès à la galerie pour importer une vidéo.'
//       );
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (result.canceled) return;

//     const selected = result.assets?.[0];
//     if (!selected?.uri) {
//       Alert.alert('Erreur', 'Impossible de récupérer la vidéo sélectionnée.');
//       return;
//     }

//     navigation.navigate('VideoRecorder', {
//       departure,
//       destination,
//       pathType,
//       videoSource: 'gallery',
//       selectedVideo: {
//         uri: selected.uri,
//         duration: selected.duration ?? null,
//         fileName: selected.fileName ?? null,
//         fileSize: selected.fileSize ?? null,
//         mimeType: selected.mimeType ?? null,
//       },
//     });
//   };

//   const handleChooseVideoSource = () => {
//     Alert.alert(
//       'Choisir la source vidéo',
//       'Souhaitez-vous enregistrer une nouvelle vidéo ou en importer une depuis la galerie ?',
//       [
//         { text: 'Annuler', style: 'cancel' },
//         { text: 'Galerie', onPress: handlePickFromGallery },
//         { text: 'Enregistrer', onPress: handleStartRecording },
//       ]
//     );
//   };

//   const SelectModal = ({ visible, onClose, onSelect, title, selected }) => (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>{title}</Text>
//             <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           {loadingLocations ? (
//             <View style={styles.modalLoading}>
//               <ActivityIndicator size="large" color="#FEBD00" />
//               <Text style={styles.modalLoadingText}>Chargement des destinations...</Text>
//             </View>
//           ) : locations.length === 0 ? (
//             <View style={styles.modalEmpty}>
//               <Ionicons name="location-outline" size={48} color="#ccc" />
//               <Text style={styles.modalEmptyText}>Aucune destination disponible</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={locations}
//               keyExtractor={(item) => item}
//               contentContainerStyle={styles.modalList}
//               renderItem={({ item }) => {
//                 const isSelected = item === selected;
//                 return (
//                   <TouchableOpacity
//                     style={[styles.modalItem, isSelected && styles.modalItemSelected]}
//                     onPress={() => {
//                       onSelect(item);
//                       onClose();
//                     }}
//                   >
//                     <Ionicons
//                       name={isSelected ? 'radio-button-on' : 'radio-button-off'}
//                       size={20}
//                       color={isSelected ? '#FEBD00' : '#ccc'}
//                     />
//                     <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
//                       {item}
//                     </Text>
//                     {isSelected && <Ionicons name="checkmark" size={18} color="#FEBD00" />}
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
//         <Text style={styles.headerTitle}>Créer un chemin</Text>
//         <Text style={styles.headerSubtitle}>Aidez la communauté à se déplacer</Text>
//       </LinearGradient>

//       <View style={styles.formContainer}>
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>
//             <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
//           </Text>
//           <TouchableOpacity
//             style={[styles.selector, departure ? styles.selectorFilled : null]}
//             onPress={() => setShowDepartureModal(true)}
//           >
//             <Ionicons name="location" size={20} color={departure ? '#34C759' : '#ccc'} />
//             <Text style={[styles.selectorText, !departure && styles.selectorPlaceholder]}>
//               {departure || 'Sélectionner un départ...'}
//             </Text>
//             <Ionicons name="chevron-down" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>
//             <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
//           </Text>
//           <TouchableOpacity
//             style={[styles.selector, destination ? styles.selectorFilled : null]}
//             onPress={() => setShowDestinationModal(true)}
//           >
//             <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
//             <Text style={[styles.selectorText, !destination && styles.selectorPlaceholder]}>
//               {destination || 'Sélectionner une destination...'}
//             </Text>
//             <Ionicons name="chevron-down" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>

//         {departure && destination && (
//           <View style={styles.routePreview}>
//             <Ionicons name="navigate" size={18} color="#FEBD00" />
//             <Text style={styles.routePreviewText}>
//               {departure} → {destination}
//             </Text>
//           </View>
//         )}

//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Type de chemin</Text>
//           <View style={styles.typeContainer}>
//             <TouchableOpacity
//               style={[styles.typeCard, pathType === 'community' && styles.typeCardActive]}
//               onPress={() => setPathType('community')}
//             >
//               <Ionicons
//                 name="people-outline"
//                 size={32}
//                 color={pathType === 'community' ? '#FEBD00' : '#666'}
//               />
//               <Text style={[styles.typeTitle, pathType === 'community' && styles.typeTitleActive]}>
//                 Communautaire
//               </Text>
//               <Text style={styles.typeDescription}>Partagé avec tous les utilisateurs</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.typeCard, pathType === 'official' && styles.typeCardActive]}
//               onPress={() => setPathType('official')}
//             >
//               <Ionicons
//                 name="shield-checkmark-outline"
//                 size={32}
//                 color={pathType === 'official' ? '#FEBD00' : '#666'}
//               />
//               <Text style={[styles.typeTitle, pathType === 'official' && styles.typeTitleActive]}>
//                 Officiel
//               </Text>
//               <Text style={styles.typeDescription}>Vérifié par votre établissement</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.instructionsCard}>
//           <Text style={styles.instructionsTitle}>
//             <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
//           </Text>
//           <View style={styles.instructionsList}>
//             {[
//               'Enregistrez une vidéo verticale (≤ 45 secondes) du trajet',
//               'Ou importez une vidéo existante depuis la galerie',
//               'Découpez en 2-6 étapes importantes',
//               'Ajoutez des instructions pour chaque étape',
//             ].map((text, i) => (
//               <View key={i} style={styles.instructionItem}>
//                 <View style={styles.instructionNumber}>
//                   <Text style={styles.instructionNumberText}>{i + 1}</Text>
//                 </View>
//                 <Text style={styles.instructionText}>{text}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         <TouchableOpacity style={styles.startButton} onPress={handleChooseVideoSource}>
//           <Ionicons name="videocam" size={24} color="#fff" />
//           <Text style={styles.startButtonText}>Choisir la source vidéo</Text>
//         </TouchableOpacity>

//         <View style={styles.quickActionsRow}>
//           <TouchableOpacity style={styles.quickActionBtn} onPress={handleStartRecording}>
//             <Ionicons name="camera" size={18} color="#FEBD00" />
//             <Text style={styles.quickActionText}>Enregistrer</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.quickActionBtn} onPress={handlePickFromGallery}>
//             <Ionicons name="images-outline" size={18} color="#FEBD00" />
//             <Text style={styles.quickActionText}>Galerie</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <SelectModal
//         visible={showDepartureModal}
//         onClose={() => setShowDepartureModal(false)}
//         onSelect={setDeparture}
//         title="Choisir le point de départ"
//         selected={departure}
//       />
//       <SelectModal
//         visible={showDestinationModal}
//         onClose={() => setShowDestinationModal(false)}
//         onSelect={setDestination}
//         title="Choisir la destination"
//         selected={destination}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
//   headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
//   headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
//   formContainer: { padding: 20 },
//   inputGroup: { marginBottom: 24 },
//   label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },

//   selector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     gap: 10,
//   },
//   selectorFilled: {
//     borderColor: '#FEBD00',
//     backgroundColor: '#FFFBF0',
//   },
//   selectorText: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
//   selectorPlaceholder: { color: '#999', fontWeight: '400' },

//   routePreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF4D6',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 24,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#FFE082',
//   },
//   routePreviewText: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },

//   typeContainer: { flexDirection: 'row', gap: 12 },
//   typeCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#e0e0e0',
//   },
//   typeCardActive: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
//   typeTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4, marginTop: 8 },
//   typeTitleActive: { color: '#FEBD00' },
//   typeDescription: { fontSize: 12, color: '#666', textAlign: 'center' },

//   instructionsCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#FFF4D6',
//   },
//   instructionsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
//   instructionsList: { gap: 12 },
//   instructionItem: { flexDirection: 'row', alignItems: 'flex-start' },
//   instructionNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#FEBD00',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   instructionNumberText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
//   instructionText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20, paddingTop: 4 },

//   startButton: {
//     flexDirection: 'row',
//     backgroundColor: '#FEBD00',
//     padding: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#FEBD00',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   startButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },

//   quickActionsRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 8 },
//   quickActionBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#F2D58A',
//     backgroundColor: '#FFF9E8',
//     borderRadius: 10,
//     paddingVertical: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,
//   },
//   quickActionText: { color: '#8B6B00', fontWeight: '700' },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '75%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   modalCloseBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalList: { paddingVertical: 8, paddingHorizontal: 16 },
//   modalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     gap: 12,
//     marginBottom: 4,
//   },
//   modalItemSelected: { backgroundColor: '#FFFBF0' },
//   modalItemText: { flex: 1, fontSize: 16, color: '#333' },
//   modalItemTextSelected: { fontWeight: '600', color: '#FEBD00' },
//   modalLoading: { padding: 40, alignItems: 'center', gap: 12 },
//   modalLoadingText: { fontSize: 14, color: '#666' },
//   modalEmpty: { padding: 40, alignItems: 'center', gap: 12 },
//   modalEmptyText: { fontSize: 14, color: '#999' },
// });

