// lib/presentation/user/profile/cubit/profile_state.dart
import 'package:equatable/equatable.dart';

class ProfileState extends Equatable {
  // Basic Info
  final String fullName;
  final String email;
  final String phone;
  final String? profileImageUrl;
  final String currentLanguage; // ← ADD THIS

  // Medical Stats
  final String bloodType;
  final int heightCm;
  final int weightKg;
  final String pregnancyStatus;
  final String medicalNotes;

  // Medical Details (Lists of Maps for flexibility)
  final List<Map<String, String>> medications;
  final List<Map<String, String>> allergies;
  final List<Map<String, String>> chronicDiseases;
  final List<Map<String, String>> pastSurgeries;
  final List<Map<String, String>> emergencyContacts;

  const ProfileState({
    this.fullName = '',
    this.email = '',
    this.phone = '',
    this.profileImageUrl,
    this.currentLanguage = 'English', // ← ADD THIS
    this.bloodType = '',
    this.heightCm = 0,
    this.weightKg = 0,
    this.pregnancyStatus = '',
    this.medicalNotes = '',
    this.medications = const [],
    this.allergies = const [],
    this.chronicDiseases = const [],
    this.pastSurgeries = const [],
    this.emergencyContacts = const [],
  });

  @override
  List<Object?> get props => [
    fullName,
    email,
    phone,
    profileImageUrl,
    currentLanguage, // ← ADD THIS
    bloodType,
    heightCm,
    weightKg,
    pregnancyStatus,
    medicalNotes,
    medications,
    allergies,
    chronicDiseases,
    pastSurgeries,
    emergencyContacts,
  ];
  // Add this method to ProfileState class
  ProfileState copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? profileImageUrl,
    String? currentLanguage,
    String? bloodType,
    int? heightCm,
    int? weightKg,
    String? pregnancyStatus,
    String? medicalNotes,
    List<Map<String, String>>? medications,
    List<Map<String, String>>? allergies,
    List<Map<String, String>>? chronicDiseases,
    List<Map<String, String>>? pastSurgeries,
    List<Map<String, String>>? emergencyContacts,
  }) {
    return ProfileState(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      currentLanguage: currentLanguage ?? this.currentLanguage,
      bloodType: bloodType ?? this.bloodType,
      heightCm: heightCm ?? this.heightCm,
      weightKg: weightKg ?? this.weightKg,
      pregnancyStatus: pregnancyStatus ?? this.pregnancyStatus,
      medicalNotes: medicalNotes ?? this.medicalNotes,
      medications: medications ?? this.medications,
      allergies: allergies ?? this.allergies,
      chronicDiseases: chronicDiseases ?? this.chronicDiseases,
      pastSurgeries: pastSurgeries ?? this.pastSurgeries,
      emergencyContacts: emergencyContacts ?? this.emergencyContacts,
    );
  }
}
