// lib/presentation/user/profile/views/profile_screen.dart
// PURE MVVM — Bloc only in BlocBuilder/BlocConsumer. Views never call Bloc directly.
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/cubit/theme/theme_cubit.dart';
import 'package:rescufy/core/cubit/theme/theme_state.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_cubit.dart';
import 'package:rescufy/presentation/auth/cubit/auth/auth_state.dart';
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
import '../widgets/edit_bottom_sheet.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProfileCubit>().initialize(context);
    });
  }

  // ──────────────────────────────────────────────────────────
  // SHEET HELPERS — open sheets, then call cubit on save
  // ──────────────────────────────────────────────────────────

  void _openMedicalInfoEdit(BuildContext ctx, ProfileState state) {
    final cubit = ctx.read<ProfileCubit>();
    _showSheet(
      ctx,
      EditMedicalInfoSheet(
        pregnancyStatus: state.pregnancyStatus,
        medicalNotes: state.medicalNotes,
        onSave: (status, notes) => cubit.updateMedicalInfo(
          pregnancyStatus: status,
          medicalNotes: notes,
        ),
      ),
    );
  }

  void _openAddMedication(BuildContext ctx) {
    _showSheet(
      ctx,
      EditMedicationSheet(
        onSave: (data) => ctx.read<ProfileCubit>().addMedication(data),
      ),
    );
  }

  void _openEditMedication(
    BuildContext ctx,
    int index,
    Map<String, String> med,
  ) {
    _showSheet(
      ctx,
      EditMedicationSheet(
        existing: med,
        onSave: (data) =>
            ctx.read<ProfileCubit>().updateMedication(index, data),
      ),
    );
  }

  void _openAddAllergy(BuildContext ctx) {
    _showSheet(
      ctx,
      EditAllergySheet(
        onSave: (data) => ctx.read<ProfileCubit>().addAllergy(data),
      ),
    );
  }

  void _openEditAllergy(
    BuildContext ctx,
    int index,
    Map<String, String> allergy,
  ) {
    _showSheet(
      ctx,
      EditAllergySheet(
        existing: allergy,
        onSave: (data) => ctx.read<ProfileCubit>().updateAllergy(index, data),
      ),
    );
  }

  void _openAddDisease(BuildContext ctx) {
    _showSheet(
      ctx,
      EditDiseaseSheet(
        onSave: (data) => ctx.read<ProfileCubit>().addDisease(data),
      ),
    );
  }

  void _openEditDisease(
    BuildContext ctx,
    int index,
    Map<String, String> disease,
  ) {
    _showSheet(
      ctx,
      EditDiseaseSheet(
        existing: disease,
        onSave: (data) => ctx.read<ProfileCubit>().updateDisease(index, data),
      ),
    );
  }

  void _openAddSurgery(BuildContext ctx) {
    _showSheet(
      ctx,
      EditSurgerySheet(
        onSave: (data) => ctx.read<ProfileCubit>().addSurgery(data),
      ),
    );
  }

  void _openEditSurgery(
    BuildContext ctx,
    int index,
    Map<String, String> surgery,
  ) {
    _showSheet(
      ctx,
      EditSurgerySheet(
        existing: surgery,
        onSave: (data) => ctx.read<ProfileCubit>().updateSurgery(index, data),
      ),
    );
  }

  void _openAddContact(BuildContext ctx) {
    _showSheet(
      ctx,
      EditContactSheet(
        onSave: (data) => ctx.read<ProfileCubit>().addContact(data),
      ),
    );
  }

  void _openEditContact(
    BuildContext ctx,
    int index,
    Map<String, String> contact,
  ) {
    _showSheet(
      ctx,
      EditContactSheet(
        existing: contact,
        onSave: (data) => ctx.read<ProfileCubit>().updateContact(index, data),
      ),
    );
  }

  void _showSheet(BuildContext ctx, Widget sheet) {
    showModalBottomSheet(
      context: ctx,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => sheet,
    );
  }

  void _confirmDelete(BuildContext ctx, String label, VoidCallback onConfirm) {
    showDialog(
      context: ctx,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.r),
        ),
        title: Text('Remove $label?'),
        content: Text('This will permanently delete this $label.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogCtx);
              onConfirm();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<AuthCubit>().logout();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────────────────
  // BUILD
  // ──────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.profile),
        actions: [
          BlocBuilder<ThemeCubit, ThemeState>(
            builder: (context, state) {
              final isDarkMode = state.themeMode == ThemeMode.dark;
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
                      onChanged: (_) =>
                          context.read<ThemeCubit>().toggleTheme(),
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
      body: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) {
          if (state is AuthUnauthenticated) {
            Navigator.pushNamedAndRemoveUntil(
              context,
              state.route,
              (route) => false,
            );
          } else if (state is AuthFailure) {
            ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar()
              ..showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                  behavior: SnackBarBehavior.floating,
                ),
              );
          }
        },
        child: BlocConsumer<ProfileCubit, ProfileState>(
          listenWhen: (prev, curr) =>
              curr.updateSuccess != null || curr.updateError != null,
          listener: (context, state) {
            if (state.updateSuccess != null) {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          color: Colors.white,
                          size: 20,
                        ),
                        SizedBox(width: 8.w),
                        Text(state.updateSuccess!),
                      ],
                    ),
                    backgroundColor: Colors.green.shade700,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.r),
                    ),
                    margin: EdgeInsets.all(16.w),
                    duration: const Duration(seconds: 2),
                  ),
                );
            } else if (state.updateError != null) {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  SnackBar(
                    content: Text(state.updateError!),
                    backgroundColor: Colors.red,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
            }
          },
          builder: (context, state) {
            final cubit = context.read<ProfileCubit>();

            return SingleChildScrollView(
              padding: EdgeInsets.all(20.w),
              child: Column(
                children: [
                  // ── Profile Header ──
                  ProfileHeader(
                    fullName: state.fullName,
                    email: state.email,
                    phone: state.phone,
                    profileImageUrl: state.profileImageUrl,
                    onEditPressed: cubit.navigateToEditProfile,
                  ),
                  SizedBox(height: 24.h),

                  // ── Quick Stats ──
                  QuickStatsRow(
                    bloodType: state.bloodType,
                    heightCm: state.heightCm,
                    weightKg: state.weightKg,
                  ),
                  SizedBox(height: 24.h),

                  // ── Medical Information ──
                  MedicalInfoCard(
                    pregnancyStatus: state.pregnancyStatus,
                    medicalNotes: state.medicalNotes,
                    onEditPressed: () => _openMedicalInfoEdit(context, state),
                  ),
                  SizedBox(height: 24.h),

                  // ── Medications ──
                  ExpandableSection(
                    title: 'Medications',
                    icon: Icons.medication,
                    count: state.medications.length,
                    onAdd: () => _openAddMedication(context),
                    children: state.medications.asMap().entries.map((e) {
                      final i = e.key;
                      final med = e.value;
                      return MedicationCard(
                        medication: med,
                        onEdit: () => _openEditMedication(context, i, med),
                        onDelete: () => _confirmDelete(
                          context,
                          'medication',
                          () => cubit.deleteMedication(i),
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 24.h),

                  // ── Allergies ──
                  ExpandableSection(
                    title: 'Allergies',
                    icon: Icons.warning_amber_rounded,
                    count: state.allergies.length,
                    color: Colors.orange,
                    onAdd: () => _openAddAllergy(context),
                    children: state.allergies.asMap().entries.map((e) {
                      final i = e.key;
                      final allergy = e.value;
                      return AllergyCard(
                        allergy: allergy,
                        onEdit: () => _openEditAllergy(context, i, allergy),
                        onDelete: () => _confirmDelete(
                          context,
                          'allergy',
                          () => cubit.deleteAllergy(i),
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 24.h),

                  // ── Chronic Diseases ──
                  ExpandableSection(
                    title: 'Chronic Diseases',
                    icon: Icons.local_hospital,
                    count: state.chronicDiseases.length,
                    color: Colors.purple,
                    onAdd: () => _openAddDisease(context),
                    children: state.chronicDiseases.asMap().entries.map((e) {
                      final i = e.key;
                      final disease = e.value;
                      return DiseaseCard(
                        disease: disease,
                        onEdit: () => _openEditDisease(context, i, disease),
                        onDelete: () => _confirmDelete(
                          context,
                          'disease',
                          () => cubit.deleteDisease(i),
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 24.h),

                  // ── Past Surgeries ──
                  ExpandableSection(
                    title: 'Past Surgeries',
                    icon: Icons.healing,
                    count: state.pastSurgeries.length,
                    color: Colors.teal,
                    onAdd: () => _openAddSurgery(context),
                    children: state.pastSurgeries.asMap().entries.map((e) {
                      final i = e.key;
                      final surgery = e.value;
                      return SurgeryCard(
                        surgery: surgery,
                        onEdit: () => _openEditSurgery(context, i, surgery),
                        onDelete: () => _confirmDelete(
                          context,
                          'surgery',
                          () => cubit.deleteSurgery(i),
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 24.h),

                  // ── Emergency Contacts ──
                  ExpandableSection(
                    title: 'Emergency Contacts',
                    icon: Icons.contact_phone,
                    count: state.emergencyContacts.length,
                    color: Colors.red,
                    onAdd: () => _openAddContact(context),
                    children: state.emergencyContacts.asMap().entries.map((e) {
                      final i = e.key;
                      final contact = e.value;
                      return ContactCard(
                        contact: contact,
                        onCallPressed: () =>
                            cubit.callEmergencyContact(contact['phone']!),
                        onEdit: () => _openEditContact(context, i, contact),
                        onDelete: () => _confirmDelete(
                          context,
                          'contact',
                          () => cubit.deleteContact(i),
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 24.h),

                  // ── Settings ──
                  SettingsSection(
                    onNotificationsTap: cubit.navigateToNotifications,
                    onLanguageTap: cubit.navigateToLanguage,
                    onPrivacyTap: cubit.navigateToPrivacy,
                    onHelpTap: cubit.navigateToHelp,
                    currentLanguage: state.currentLanguage,
                  ),
                  SizedBox(height: 32.h),

                  // ── Logout ──
                  SizedBox(
                    width: double.infinity,
                    height: 56.h,
                    child: OutlinedButton.icon(
                      onPressed: () => _showLogoutDialog(context),
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
      ),
    );
  }
}
