// lib/presentation/user/profile/cubit/profile_cubit.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';
import 'profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {
  final LocaleCubit _localeCubit;
  StreamSubscription? _localeSubscription;

  ProfileCubit(this._localeCubit) : super(const ProfileState()) {
    // Listen to locale changes
    _localeSubscription = _localeCubit.stream.listen((localeState) {
      _updateLanguage();
    });
    // Set initial language
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
        // Basic Info
        fullName: 'Sara John',
        email: 'sara.john@email.com',
        phone: '+1 (555) 123-4567',
        profileImageUrl: null,
        currentLanguage: _localeCubit.currentLanguageName, // ← GET FROM CUBIT
        // Medical Stats
        bloodType: 'O+',
        heightCm: 170,
        weightKg: 65,
        pregnancyStatus: 'Not Pregnant',
        medicalNotes: 'Regular checkups needed',

        // Medications
        medications: [
          {
            'name': 'Albuterol Inhaler',
            'dosage': '2 puffs',
            'frequency': 'As needed',
          },
          {'name': 'Vitamin D', 'dosage': '1000 IU', 'frequency': 'Daily'},
        ],

        // Allergies
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

        // Chronic Diseases
        chronicDiseases: [
          {'name': 'Asthma', 'severity': 'Moderate', 'diagnosed_year': '2015'},
        ],

        // Past Surgeries
        pastSurgeries: [
          {
            'name': 'Appendectomy',
            'year': '2018',
            'notes': 'Routine procedure, no complications',
          },
        ],

        // Emergency Contacts
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

  void navigateToEditProfile() {
    if (_context == null) return;
    ScaffoldMessenger.of(
      _context!,
    ).showSnackBar(const SnackBar(content: Text('Edit Profile - Coming Soon')));
  }

  void navigateToEditMedicalInfo() {
    if (_context == null) return;
    ScaffoldMessenger.of(_context!).showSnackBar(
      const SnackBar(content: Text('Edit Medical Info - Coming Soon')),
    );
  }

  void navigateToNotifications() {
    if (_context == null) return;
    // TODO: Navigate to notifications settings
  }

  void navigateToLanguage() {
    if (_context == null) return;
    Navigator.of(_context!).pushNamed('/language');
  }

  void navigateToPrivacy() {
    if (_context == null) return;
    // TODO: Navigate to privacy settings
  }

  void navigateToHelp() {
    if (_context == null) return;
    // TODO: Navigate to help screen
  }

  void callEmergencyContact(String phone) {
    if (_context == null) return;
    ScaffoldMessenger.of(
      _context!,
    ).showSnackBar(SnackBar(content: Text('Calling $phone...')));
  }

  void showLogoutDialog() {
    if (_context == null) return;

    showDialog(
      context: _context!,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _performLogout();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  void _performLogout() {
    if (_context == null) return;
    Navigator.of(_context!).pushReplacementNamed('/login');
  }

  @override
  Future<void> close() {
    _localeSubscription?.cancel();
    return super.close();
  }
}
