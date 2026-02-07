// screens/Ajouter.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Ajouter({ navigation }) {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [pathType, setPathType] = useState('community'); // 'community' ou 'official'

  const handleStartRecording = () => {
    // Validation
    if (!departure || !destination) {
      Alert.alert('Erreur', 'Veuillez remplir le point de départ et la destination');
      return;
    }

    // TODO: Navigation vers l'écran d'enregistrement vidéo
    Alert.alert(
      'Enregistrement',
      `De: ${departure}\nVers: ${destination}\nType: ${pathType === 'official' ? 'Officiel' : 'Communautaire'}`,
      [
        {
          text: 'Commencer',
          onPress: () => {
            console.log('Démarrer l\'enregistrement vidéo');
            // navigation.navigate('VideoRecorder', { departure, destination, pathType });
          },
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#FEBD00', '#FFD700']} style={styles.header}>
        <Text style={styles.headerTitle}>Créer un chemin</Text>
        <Text style={styles.headerSubtitle}>
          Aidez la communauté à se déplacer
        </Text>
      </LinearGradient>

      {/* Formulaire */}
      <View style={styles.formContainer}>
        {/* Point de départ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Ionicons name="location-outline" size={16} color="#FEBD00" /> Point de départ
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Bakeli Dakar"
            value={departure}
            onChangeText={setDeparture}
            placeholderTextColor="#999"
          />
        </View>

        {/* Destination */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            <Ionicons name="flag-outline" size={16} color="#FEBD00" /> Destination
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rond-Point Liberté 6"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#999"
          />
        </View>

        {/* Type de chemin */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type de chemin</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeCard,
                pathType === 'community' && styles.typeCardActive,
              ]}
              onPress={() => setPathType('community')}
            >
              <View style={styles.typeIconContainer}>
                <Ionicons
                  name="people-outline"
                  size={32}
                  color={pathType === 'community' ? '#FEBD00' : '#666'}
                />
              </View>
              <Text
                style={[
                  styles.typeTitle,
                  pathType === 'community' && styles.typeTitleActive,
                ]}
              >
                Communautaire
              </Text>
              <Text style={styles.typeDescription}>
                Partagé avec tous les utilisateurs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeCard,
                pathType === 'official' && styles.typeCardActive,
              ]}
              onPress={() => setPathType('official')}
            >
              <View style={styles.typeIconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={32}
                  color={pathType === 'official' ? '#FEBD00' : '#666'}
                />
              </View>
              <Text
                style={[
                  styles.typeTitle,
                  pathType === 'official' && styles.typeTitleActive,
                ]}
              >
                Officiel
              </Text>
              <Text style={styles.typeDescription}>
                Vérifié par votre établissement
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>
            <Ionicons name="information-circle-outline" size={20} color="#FEBD00" /> Comment ça marche ?
          </Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Enregistrez une vidéo verticale (≤ 45 secondes) du trajet
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Découpez en 2-6 étapes importantes
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Ajoutez des instructions pour chaque étape
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Publiez et aidez la communauté !
              </Text>
            </View>
          </View>
        </View>

        {/* Bouton Commencer */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartRecording}
        >
          <Ionicons name="videocam" size={24} color="#fff" />
          <Text style={styles.startButtonText}>Commencer l'enregistrement</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  typeCardActive: {
    borderColor: '#FEBD00',
    backgroundColor: '#FFFBF0',
  },
  typeIconContainer: {
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  typeTitleActive: {
    color: '#FEBD00',
  },
  typeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFF4D6',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEBD00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#FEBD00',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FEBD00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});