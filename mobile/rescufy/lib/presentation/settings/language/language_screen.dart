// lib/presentation/settings/language/language_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/cubit/locale/locale_cubit.dart';
import 'package:rescufy/core/cubit/locale/locale_state.dart';
import 'package:rescufy/l10n/app_localizations.dart';

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.selectLanguage), elevation: 0),
      body: BlocBuilder<LocaleCubit, LocaleState>(
        builder: (context, state) {
          final localeCubit = context.read<LocaleCubit>();
          final currentLocale = state.locale.languageCode;

          return Padding(
            padding: EdgeInsets.all(20.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.chooseYourPreferredLanguage,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                SizedBox(height: 24.h),
                _LanguageTile(
                  title: l10n.english,
                  languageCode: 'en',
                  currentLocale: currentLocale,
                  onTap: () => localeCubit.changeLocale(const Locale('en')),
                  theme: theme,
                ),
                SizedBox(height: 12.h),
                _LanguageTile(
                  title: l10n.arabic,
                  languageCode: 'ar',
                  currentLocale: currentLocale,
                  onTap: () => localeCubit.changeLocale(const Locale('ar')),
                  theme: theme,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _LanguageTile extends StatelessWidget {
  final String title;
  final String languageCode;
  final String currentLocale;
  final VoidCallback onTap;
  final ThemeData theme;

  const _LanguageTile({
    required this.title,
    required this.languageCode,
    required this.currentLocale,
    required this.onTap,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = currentLocale == languageCode;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.r),
      child: Container(
        padding: EdgeInsets.all(16.w),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primaryContainer
              : theme.cardColor,
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(
            color: isSelected ? theme.colorScheme.primary : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 24.w,
              height: 24.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? theme.colorScheme.primary
                      : theme.dividerColor,
                  width: 2,
                ),
                color: isSelected
                    ? theme.colorScheme.primary
                    : Colors.transparent,
              ),
              child: isSelected
                  ? Icon(
                      Icons.check,
                      size: 16.sp,
                      color: theme.colorScheme.onPrimary,
                    )
                  : null,
            ),
            SizedBox(width: 16.w),
            Expanded(
              child: Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: isSelected
                      ? theme.colorScheme.onPrimaryContainer
                      : theme.colorScheme.onSurface,
                ),
              ),
            ),
            if (languageCode == 'ar')
              Text(
                'العربية',
                style: theme.textTheme.bodyLarge?.copyWith(fontFamily: 'Arial'),
              ),
          ],
        ),
      ),
    );
  }
}
