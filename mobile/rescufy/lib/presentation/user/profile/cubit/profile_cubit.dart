// lib/presentation/user/profile/cubit/profile_cubit.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {
  final LocaleCubit _localeCubit;
  StreamSubscription? _localeSubscription;

  ProfileCubit(this._localeCubit) : super(const ProfileState()) {
    _localeSubscription = _localeCubit.stream.listen((_) => _updateLanguage());
    _updateLanguage();
  }

  BuildContext? _context;

  void initialize(BuildContext context) {
    _context = context;
    _loadProfileData();
  }

  void _updateLanguage() {
    emit(state.copyWith(currentLanguage: _localeCubit.currentLanguageName));
  }

  void _loadProfileData() {
    emit(
      ProfileState(
        fullName: 'Omar Waqqad',
        email: 'waqad@email.com',
        phone: '01070457845',
        profileImageUrl: null,
        currentLanguage: _localeCubit.currentLanguageName,
        bloodType: 'O+',
        heightCm: 170,
        weightKg: 65,
        pregnancyStatus: 'Not Pregnant',
        medicalNotes: 'Regular checkups needed',
        medications: [
          {
            'name': 'Albuterol Inhaler',
            'dosage': '2 puffs',
            'frequency': 'As needed',
          },
          {'name': 'Vitamin D', 'dosage': '1000 IU', 'frequency': 'Daily'},
        ],
        allergies: [
          {
            'name': 'Penicillin',
            'severity': 'Severe',
            'notes': 'Anaphylaxis risk',
          },
          {
            'name': 'Peanuts',
            'severity': 'Moderate',
            'notes': 'Hives and swelling',
          },
        ],
        chronicDiseases: [
          {'name': 'Asthma', 'severity': 'Moderate', 'diagnosed_year': '2015'},
        ],
        pastSurgeries: [
          {
            'name': 'Appendectomy',
            'year': '2018',
            'notes': 'Routine procedure, no complications',
          },
        ],
        emergencyContacts: [
          {
            'name': 'John Doe',
            'phone': '+1 (555) 987-6543',
            'relation': 'Spouse',
          },
          {
            'name': 'Jane Smith',
            'phone': '+1 (555) 456-7890',
            'relation': 'Sister',
          },
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // MEDICAL INFO (pregnancyStatus + medicalNotes)
  // ─────────────────────────────────────────────
  void updateMedicalInfo({
    required String pregnancyStatus,
    required String medicalNotes,
  }) {
    emit(
      state.copyWith(
        pregnancyStatus: pregnancyStatus,
        medicalNotes: medicalNotes,
        updateSuccess: 'Medical information updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // MEDICATIONS
  // ─────────────────────────────────────────────
  void addMedication(Map<String, String> medication) {
    final updated = List<Map<String, String>>.from(state.medications)
      ..add(medication);
    emit(
      state.copyWith(
        medications: updated,
        updateSuccess: 'Medication added',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void updateMedication(int index, Map<String, String> medication) {
    final updated = List<Map<String, String>>.from(state.medications);
    updated[index] = medication;
    emit(
      state.copyWith(
        medications: updated,
        updateSuccess: 'Medication updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void deleteMedication(int index) {
    final updated = List<Map<String, String>>.from(state.medications)
      ..removeAt(index);
    emit(
      state.copyWith(
        medications: updated,
        updateSuccess: 'Medication removed',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // ALLERGIES
  // ─────────────────────────────────────────────
  void addAllergy(Map<String, String> allergy) {
    final updated = List<Map<String, String>>.from(state.allergies)
      ..add(allergy);
    emit(
      state.copyWith(
        allergies: updated,
        updateSuccess: 'Allergy added',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void updateAllergy(int index, Map<String, String> allergy) {
    final updated = List<Map<String, String>>.from(state.allergies);
    updated[index] = allergy;
    emit(
      state.copyWith(
        allergies: updated,
        updateSuccess: 'Allergy updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void deleteAllergy(int index) {
    final updated = List<Map<String, String>>.from(state.allergies)
      ..removeAt(index);
    emit(
      state.copyWith(
        allergies: updated,
        updateSuccess: 'Allergy removed',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // CHRONIC DISEASES
  // ─────────────────────────────────────────────
  void addDisease(Map<String, String> disease) {
    final updated = List<Map<String, String>>.from(state.chronicDiseases)
      ..add(disease);
    emit(
      state.copyWith(
        chronicDiseases: updated,
        updateSuccess: 'Disease added',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void updateDisease(int index, Map<String, String> disease) {
    final updated = List<Map<String, String>>.from(state.chronicDiseases);
    updated[index] = disease;
    emit(
      state.copyWith(
        chronicDiseases: updated,
        updateSuccess: 'Disease updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void deleteDisease(int index) {
    final updated = List<Map<String, String>>.from(state.chronicDiseases)
      ..removeAt(index);
    emit(
      state.copyWith(
        chronicDiseases: updated,
        updateSuccess: 'Disease removed',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // PAST SURGERIES
  // ─────────────────────────────────────────────
  void addSurgery(Map<String, String> surgery) {
    final updated = List<Map<String, String>>.from(state.pastSurgeries)
      ..add(surgery);
    emit(
      state.copyWith(
        pastSurgeries: updated,
        updateSuccess: 'Surgery added',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void updateSurgery(int index, Map<String, String> surgery) {
    final updated = List<Map<String, String>>.from(state.pastSurgeries);
    updated[index] = surgery;
    emit(
      state.copyWith(
        pastSurgeries: updated,
        updateSuccess: 'Surgery updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void deleteSurgery(int index) {
    final updated = List<Map<String, String>>.from(state.pastSurgeries)
      ..removeAt(index);
    emit(
      state.copyWith(
        pastSurgeries: updated,
        updateSuccess: 'Surgery removed',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // EMERGENCY CONTACTS
  // ─────────────────────────────────────────────
  void addContact(Map<String, String> contact) {
    final updated = List<Map<String, String>>.from(state.emergencyContacts)
      ..add(contact);
    emit(
      state.copyWith(
        emergencyContacts: updated,
        updateSuccess: 'Contact added',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void updateContact(int index, Map<String, String> contact) {
    final updated = List<Map<String, String>>.from(state.emergencyContacts);
    updated[index] = contact;
    emit(
      state.copyWith(
        emergencyContacts: updated,
        updateSuccess: 'Contact updated',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  void deleteContact(int index) {
    final updated = List<Map<String, String>>.from(state.emergencyContacts)
      ..removeAt(index);
    emit(
      state.copyWith(
        emergencyContacts: updated,
        updateSuccess: 'Contact removed',
        clearUpdateError: true,
      ),
    );
    _clearFeedback();
  }

  // ─────────────────────────────────────────────
  // NAVIGATION / MISC
  // ─────────────────────────────────────────────
  void navigateToEditProfile() {
    if (_context == null) return;
    ScaffoldMessenger.of(
      _context!,
    ).showSnackBar(const SnackBar(content: Text('Edit Profile - Coming Soon')));
  }

  void navigateToNotifications() {}
  void navigateToLanguage() {
    if (_context == null) return;
    Navigator.of(_context!).pushNamed(AppRoutes.language);
  }

  void navigateToPrivacy() {}
  void navigateToHelp() {}

  void callEmergencyContact(String phone) {
    if (_context == null) return;
    ScaffoldMessenger.of(
      _context!,
    ).showSnackBar(SnackBar(content: Text('Calling $phone...')));
  }

  void _clearFeedback() {
    Future.delayed(const Duration(seconds: 3), () {
      if (!isClosed) {
        emit(state.copyWith(clearUpdateSuccess: true, clearUpdateError: true));
      }
    });
  }

  @override
  Future<void> close() {
    _localeSubscription?.cancel();
    return super.close();
  }
}
