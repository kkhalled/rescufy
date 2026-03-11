// lib/presentation/features/profile/views/paramedic_profile_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/theme/theme_state.dart';
import 'package:rescufy/l10n/app_localizations.dart';
import '../cubit/profile_cubit.dart';
import '../cubit/profile_state.dart';
import '../widgets/profile_header.dart';
import '../widgets/quick_stats_row.dart';
import '../widgets/medical_info_card.dart';
import '../widgets/expandable_section.dart';
import '../widgets/medication_card.dart';
import '../widgets/allergy_card.dart';
import '../widgets/disease_card.dart';
import '../widgets/surgery_card.dart';
import '../widgets/contact_card.dart';
import '../widgets/settings_section.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    // Initialize ProfileCubit with context after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProfileCubit>().initialize(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.profile),
        actions: [
          // Theme Switcher
          BlocBuilder<ThemeCubit, ThemeState>(
            builder: (context, state) {
              final isDarkMode = state.themeMode == ThemeMode.dark;
              final themeCubit = context.read<ThemeCubit>();

              return Padding(
                padding: EdgeInsets.only(right: 8.w),
                child: Row(
                  children: [
                    Icon(
                      Icons.light_mode,
                      size: 20.sp,
                      color: !isDarkMode
                          ? theme.colorScheme.primary
                          : Colors.grey,
                    ),
                    SizedBox(width: 4.w),
                    Switch(
                      value: isDarkMode,
                      onChanged: (_) => themeCubit.toggleTheme(),
                    ),
                    SizedBox(width: 4.w),
                    Icon(
                      Icons.dark_mode,
                      size: 20.sp,
                      color: isDarkMode
                          ? theme.colorScheme.primary
                          : Colors.grey,
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: BlocBuilder<ProfileCubit, ProfileState>(
        builder: (context, state) {
          final cubit = context.read<ProfileCubit>();

          return SingleChildScrollView(
            padding: EdgeInsets.all(20.w),
            child: Column(
              children: [
                // Profile Header
                ProfileHeader(
                  fullName: state.fullName,
                  email: state.email,
                  phone: state.phone,
                  profileImageUrl: state.profileImageUrl,
                  onEditPressed: cubit.navigateToEditProfile,
                ),

                SizedBox(height: 24.h),

                // Quick Stats
                QuickStatsRow(
                  bloodType: state.bloodType,
                  heightCm: state.heightCm,
                  weightKg: state.weightKg,
                ),

                SizedBox(height: 24.h),

                // Medical Information
                MedicalInfoCard(
                  pregnancyStatus: state.pregnancyStatus,
                  medicalNotes: state.medicalNotes,
                  onEditPressed: cubit.navigateToEditMedicalInfo,
                ),

                SizedBox(height: 24.h),

                // Medications
                ExpandableSection(
                  title: 'Medications',
                  icon: Icons.medication,
                  count: state.medications.length,
                  children: state.medications
                      .map((med) => MedicationCard(medication: med))
                      .toList(),
                ),

                SizedBox(height: 24.h),

                // Allergies
                ExpandableSection(
                  title: 'Allergies',
                  icon: Icons.warning_amber_rounded,
                  count: state.allergies.length,
                  color: Colors.orange,
                  children: state.allergies
                      .map((allergy) => AllergyCard(allergy: allergy))
                      .toList(),
                ),

                SizedBox(height: 24.h),

                // Chronic Diseases
                ExpandableSection(
                  title: 'Chronic Diseases',
                  icon: Icons.local_hospital,
                  count: state.chronicDiseases.length,
                  color: Colors.purple,
                  children: state.chronicDiseases
                      .map((disease) => DiseaseCard(disease: disease))
                      .toList(),
                ),

                SizedBox(height: 24.h),

                // Past Surgeries
                ExpandableSection(
                  title: 'Past Surgeries',
                  icon: Icons.healing,
                  count: state.pastSurgeries.length,
                  color: Colors.teal,
                  children: state.pastSurgeries
                      .map((surgery) => SurgeryCard(surgery: surgery))
                      .toList(),
                ),

                SizedBox(height: 24.h),

                // Emergency Contacts
                ExpandableSection(
                  title: 'Emergency Contacts',
                  icon: Icons.contact_phone,
                  count: state.emergencyContacts.length,
                  color: Colors.red,
                  children: state.emergencyContacts
                      .map(
                        (contact) => ContactCard(
                          contact: contact,
                          onCallPressed: () =>
                              cubit.callEmergencyContact(contact['phone']!),
                        ),
                      )
                      .toList(),
                ),

                SizedBox(height: 24.h),

                // Settings
                SettingsSection(
                  onNotificationsTap: cubit.navigateToNotifications,
                  onLanguageTap: cubit.navigateToLanguage,
                  onPrivacyTap: cubit.navigateToPrivacy,
                  onHelpTap: cubit.navigateToHelp,
                  currentLanguage: state.currentLanguage, // ← FROM STATE!
                ),

                SizedBox(height: 32.h),

                // Logout Button
                SizedBox(
                  width: double.infinity,
                  height: 56.h,
                  child: OutlinedButton.icon(
                    onPressed: cubit.showLogoutDialog,
                    icon: const Icon(Icons.logout),
                    label: const Text('Logout'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                    ),
                  ),
                ),

                SizedBox(height: 20.h),
              ],
            ),
          );
        },
      ),
    );
  }
}
