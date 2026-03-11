// lib/core/cubit/locale/locale_cubit.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'locale_state.dart';

class LocaleCubit extends Cubit<LocaleState> {
  static const String _localeKey = 'selected_locale';
  final SharedPreferences _prefs;

  LocaleCubit(this._prefs)
    : super(LocaleState(locale: _getInitialLocale(_prefs)));

  // Load saved locale on startup
  static Locale _getInitialLocale(SharedPreferences prefs) {
    final languageCode = prefs.getString(_localeKey);
    if (languageCode != null) {
      return Locale(languageCode);
    }
    return const Locale('en'); // Default to English
  }

  // Change locale and persist to SharedPreferences
  Future<void> changeLocale(Locale locale) async {
    emit(LocaleState(locale: locale));
    await _prefs.setString(_localeKey, locale.languageCode);
  }

  // Toggle between English and Arabic
  Future<void> toggleLocale() async {
    final newLocale = state.locale.languageCode == 'en'
        ? const Locale('ar')
        : const Locale('en');
    await changeLocale(newLocale);
  }

  // Helper getters
  bool get isArabic => state.locale.languageCode == 'ar';
  bool get isEnglish => state.locale.languageCode == 'en';

  String get currentLanguageName => isArabic ? 'العربية' : 'English';
}
