
// screens/TableauDeBord/Ajouter.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Modal, FlatList, TextInput, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getEstablishments, getPathsByEstablishment } from '../../services/authService';

export default function Ajouter({ navigation }) {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#121212' : '#f5f5f5',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#333',
    subtext: isDark ? '#aaa' : '#666',
    border: isDark ? '#333' : '#e0e0e0',
    inputBg: isDark ? '#2a2a2a' : '#fff',
    placeholder: isDark ? '#666' : '#999',
    sheetBg: isDark ? '#1e1e1e' : '#fff',
    optionBg: isDark ? '#2a2a2a' : '#f9f9f9',
    cancelBg: isDark ? '#2a2a2a' : '#f5f5f5',
  };

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [pathType, setPathType] = useState('community');

  const [establishments, setEstablishments] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [loadingEstablishments, setLoadingEstablishments] = useState(true);
  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);

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
    // ✅ Délai pour laisser la modal se fermer avant d'ouvrir la galerie
    setTimeout(async () => {
      try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission refusée', "L'accès à la galerie est requis. Activez-le dans les Réglages.");
          return;
        }
        // ✅ CORRECT
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          quality: 1,
        });
        // const result = await ImagePicker.launchImageLibraryAsync({
        //   // mediaTypes: ['video'],
        //   mediaTypes: ImagePicker.MediaTypeOptions.Videos  // ✅ Nouveau
        //   allowsEditing: false,
        //   quality: 1,
        // });
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
      } catch (e) {
        console.error('❌ Erreur galerie:', e);
        Alert.alert('Erreur', "Impossible d'ouvrir la galerie.");
      }
    }, 500);
  };

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>

      <LinearGradient colors={['#FEBD00', '#FFD700']} style={s.header}>
        <Text style={s.headerTitle}>Créer un chemin</Text>
        <Text style={s.headerSubtitle}>Aidez la communauté à se déplacer</Text>
      </LinearGradient>

      <View style={s.form}>

        {/* ── Établissement ── */}
        <View style={s.group}>
          <Text style={[s.label, { color: theme.text }]}>
            <Ionicons name="business-outline" size={16} color="#FEBD00" /> Établissement
          </Text>
          {loadingEstablishments ? (
            <ActivityIndicator color="#FEBD00" />
          ) : (
            <TouchableOpacity
              style={[s.inputRow, { backgroundColor: theme.inputBg, borderColor: selectedEstablishment ? '#FEBD00' : theme.border }, selectedEstablishment && s.inputRowYellow]}
              onPress={() => setShowEstablishmentModal(true)}
            >
              <Ionicons name="business" size={20} color={selectedEstablishment ? '#FEBD00' : '#ccc'} />
              <Text style={[s.selectorTxt, { color: selectedEstablishment ? theme.text : theme.placeholder }]}>
                {selectedEstablishment ? selectedEstablishment.name : 'Sélectionner un établissement...'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Départ ── */}
        <View style={s.group}>
          <Text style={[s.label, { color: theme.text }]}>
            <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
          </Text>
          <View style={[s.inputRow, { backgroundColor: theme.inputBg, borderColor: departure ? '#34C759' : theme.border }, departure && s.inputRowGreen]}>
            <Ionicons name="location" size={20} color={departure ? '#34C759' : '#ccc'} />
            <TextInput
              style={[s.input, { color: theme.text }]}
              placeholder="Ex: Bakeli Dakar"
              placeholderTextColor={theme.placeholder}
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
          <Text style={[s.label, { color: theme.text }]}>
            <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
          </Text>
          <TouchableOpacity
            style={[s.inputRow, { backgroundColor: theme.inputBg, borderColor: destination ? '#FEBD00' : theme.border }, destination && s.inputRowYellow]}
            onPress={() => selectedEstablishment
              ? setShowDestinationModal(true)
              : Alert.alert('Attention', "Sélectionnez d'abord un établissement")
            }
          >
            <Ionicons name="flag" size={20} color={destination ? '#FF3B30' : '#ccc'} />
            <Text style={[s.selectorTxt, { color: destination ? theme.text : theme.placeholder }]}>
              {loadingLocations ? 'Chargement...' : destination || 'Sélectionner une destination...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Aperçu trajet */}
        {departure.trim() !== '' && destination !== '' && (
          <View style={[s.preview, { backgroundColor: isDark ? '#2a2200' : '#FFF4D6', borderColor: '#FFE082' }]}>
            <Ionicons name="navigate" size={18} color="#FEBD00" />
            <Text style={[s.previewTxt, { color: theme.text }]}>{departure.trim()} → {destination}</Text>
          </View>
        )}

        {/* ── Type de chemin ── */}
        <View style={s.group}>
          <Text style={[s.label, { color: theme.text }]}>Type de chemin</Text>
          <View style={s.typeRow}>
            {[
              { key: 'community', icon: 'people-outline', label: 'Communautaire', desc: 'Partagé avec tous' },
              { key: 'official', icon: 'shield-checkmark-outline', label: 'Officiel', desc: 'Vérifié par votre établissement' },
            ].map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[s.typeCard, { backgroundColor: theme.card, borderColor: pathType === t.key ? '#FEBD00' : theme.border }, pathType === t.key && s.typeCardActive]}
                onPress={() => setPathType(t.key)}
              >
                <Ionicons name={t.icon} size={30} color={pathType === t.key ? '#FEBD00' : '#666'} />
                <Text style={[s.typeLabel, { color: pathType === t.key ? '#FEBD00' : theme.text }]}>{t.label}</Text>
                <Text style={[s.typeDesc, { color: theme.subtext }]}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Instructions ── */}
        <View style={[s.infoCard, { backgroundColor: theme.card, borderColor: isDark ? '#333' : '#FFF4D6' }]}>
          <Text style={[s.infoTitle, { color: theme.text }]}>
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
              <Text style={[s.infoTxt, { color: theme.subtext }]}>{txt}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={handleChooseSource}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={s.btnTxt}>Choisir la source de la vidéo</Text>
        </TouchableOpacity>

      </View>

      {/* ══ MODAL ÉTABLISSEMENT ══ */}
      <Modal visible={showEstablishmentModal} animationType="slide" transparent onRequestClose={() => setShowEstablishmentModal(false)}>
        <View style={s.overlay}>
          <View style={[s.sheet, { backgroundColor: theme.sheetBg }]}>
            <View style={[s.sheetHeader, { borderBottomColor: theme.border }]}>
              <Text style={[s.sheetTitle, { color: theme.text }]}>Choisir l'établissement</Text>
              <TouchableOpacity onPress={() => setShowEstablishmentModal(false)} style={[s.closeBtn, { backgroundColor: theme.optionBg }]}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>
            {establishments.length === 0 ? (
              <View style={s.center}>
                <Ionicons name="business-outline" size={48} color="#ccc" />
                <Text style={[s.centerTxt, { color: theme.subtext }]}>Aucun établissement disponible</Text>
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
                      style={[s.listItem, sel && { backgroundColor: isDark ? '#2a2000' : '#FFFBF0' }]}
                      onPress={() => handleSelectEstablishment(item)}
                    >
                      <Ionicons name={sel ? 'radio-button-on' : 'radio-button-off'} size={20} color={sel ? '#FEBD00' : '#ccc'} />
                      <Text style={[s.listItemTxt, { color: theme.text }, sel && s.listItemTxtSel]}>{item.name}</Text>
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
      <Modal visible={showDestinationModal} animationType="slide" transparent onRequestClose={() => setShowDestinationModal(false)}>
        <View style={s.overlay}>
          <View style={[s.sheet, { backgroundColor: theme.sheetBg }]}>
            <View style={[s.sheetHeader, { borderBottomColor: theme.border }]}>
              <Text style={[s.sheetTitle, { color: theme.text }]}>Choisir la destination</Text>
              <TouchableOpacity onPress={() => setShowDestinationModal(false)} style={[s.closeBtn, { backgroundColor: theme.optionBg }]}>
                <Ionicons name="close" size={22} color={theme.text} />
              </TouchableOpacity>
            </View>
            {loadingLocations ? (
              <View style={s.center}>
                <ActivityIndicator size="large" color="#FEBD00" />
                <Text style={[s.centerTxt, { color: theme.subtext }]}>Chargement...</Text>
              </View>
            ) : locations.length === 0 ? (
              <View style={s.center}>
                <Ionicons name="location-outline" size={48} color="#ccc" />
                <Text style={[s.centerTxt, { color: theme.subtext }]}>Aucune destination disponible</Text>
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
                      style={[s.listItem, sel && { backgroundColor: isDark ? '#2a2000' : '#FFFBF0' }]}
                      onPress={() => { setDestination(item); setShowDestinationModal(false); }}
                    >
                      <Ionicons name={sel ? 'radio-button-on' : 'radio-button-off'} size={20} color={sel ? '#FEBD00' : '#ccc'} />
                      <Text style={[s.listItemTxt, { color: theme.text }, sel && s.listItemTxtSel]}>{item}</Text>
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
      <Modal visible={showSourceModal} animationType="slide" transparent onRequestClose={() => setShowSourceModal(false)}>
        <View style={s.overlay}>
          <View style={[s.sourceSheet, { backgroundColor: theme.sheetBg }]}>
            <Text style={[s.sourceTitle, { color: theme.text }]}>Choisir la source de la vidéo</Text>
            <TouchableOpacity style={[s.sourceOption, { backgroundColor: theme.optionBg, borderColor: theme.border }]} onPress={handleRecord}>
              <View style={[s.sourceIcon, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="videocam" size={26} color="#fff" />
              </View>
              <View style={s.sourceTxt}>
                <Text style={[s.sourceOptTitle, { color: theme.text }]}>Enregistrement</Text>
                <Text style={[s.sourceOptDesc, { color: theme.subtext }]}>Filmez le trajet en temps réel</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={[s.sourceOption, { backgroundColor: theme.optionBg, borderColor: theme.border }]} onPress={handleGallery}>
              <View style={[s.sourceIcon, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="images" size={26} color="#fff" />
              </View>
              <View style={s.sourceTxt}>
                <Text style={[s.sourceOptTitle, { color: theme.text }]}>Galerie</Text>
                <Text style={[s.sourceOptDesc, { color: theme.subtext }]}>Choisissez une vidéo existante</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={[s.cancelBtn, { backgroundColor: theme.cancelBg }]} onPress={() => setShowSourceModal(false)}>
              <Text style={[s.cancelTxt, { color: theme.subtext }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  form: { padding: 20 },
  group: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, gap: 10 },
  inputRowGreen: { borderColor: '#34C759', backgroundColor: '#F0FFF4' },
  inputRowYellow: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
  input: { flex: 1, fontSize: 16 },
  selectorTxt: { flex: 1, fontSize: 16, fontWeight: '500' },
  preview: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 24, gap: 8, borderWidth: 1 },
  previewTxt: { fontSize: 15, fontWeight: '600', flex: 1 },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 2 },
  typeCardActive: { borderColor: '#FEBD00', backgroundColor: '#FFFBF0' },
  typeLabel: { fontSize: 15, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  typeDesc: { fontSize: 12, textAlign: 'center' },
  infoCard: { borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1 },
  infoTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  infoNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEBD00', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoNumTxt: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  infoTxt: { flex: 1, fontSize: 14, lineHeight: 20, paddingTop: 4 },
  btn: { flexDirection: 'row', backgroundColor: '#FEBD00', padding: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#FEBD00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginBottom: 40 },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  center: { padding: 40, alignItems: 'center', gap: 12 },
  centerTxt: { fontSize: 14, textAlign: 'center' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 4 },
  listItemTxt: { flex: 1, fontSize: 16 },
  listItemTxtSel: { fontWeight: '600', color: '#FEBD00' },
  sourceSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  sourceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sourceOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 12, gap: 14, borderWidth: 1 },
  sourceIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  sourceTxt: { flex: 1 },
  sourceOptTitle: { fontSize: 16, fontWeight: 'bold' },
  sourceOptDesc: { fontSize: 13, marginTop: 2 },
  cancelBtn: { marginTop: 4, paddingVertical: 16, alignItems: 'center', borderRadius: 12 },
  cancelTxt: { fontSize: 16, fontWeight: '600' },
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

